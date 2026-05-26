#!/usr/bin/env node
import sharp from 'sharp';
import { parseArgs } from 'node:util';
import fs from 'node:fs';

// 1. 解析命令行参数
const options = {
    output: { type: 'string', short: 'o' },
    verbose: { type: 'boolean' },
    threshold: { type: 'string', short: 't', default: '50' } // 默认容差提高到 50，过滤边缘阴影
};

let args;
try {
    args = parseArgs({ options, allowPositionals: true });
} catch (e) {
    console.error(`[!] 参数解析错误: ${e.message}`);
    process.exit(1);
}

const inputPath = args.positionals[0];
const outputPath = args.values.output;
const isVerbose = args.values.verbose;
const trimThreshold = parseInt(args.values.threshold, 10);

if (!inputPath || !outputPath) {
    console.error("用法: node process_hex_image.mjs <输入文件> -o <输出文件> [--verbose] [-t 容差值]");
    process.exit(1);
}

if (!fs.existsSync(inputPath)) {
    console.error(`[!] 找不到输入文件: ${inputPath}`);
    process.exit(1);
}

async function processImage() {
    if (isVerbose) {
        console.log(`[*] 正在读取图片: ${inputPath}`);
        console.log(`[*] 当前背景去噪容差(Threshold): ${trimThreshold}`);
    }

    try {
        // 2. 统一白底，并根据容差进行极端严格的裁剪
        // 容差值越大，越能切掉边缘的浅灰色阴影，只保留深色的六边形主体
        const trimmedBuffer = await sharp(inputPath)
            .flatten({ background: { r: 255, g: 255, b: 255 } }) // 去除透明度转为纯白
            .trim({ 
                background: { r: 255, g: 255, b: 255 }, 
                threshold: trimThreshold 
            })
            .toBuffer({ resolveWithObject: true });
        
        const hexWidth = trimmedBuffer.info.width;
        const hexHeight = trimmedBuffer.info.height;

        // 3. 计算正方形画布尺寸 (严格按照 1:3:1 的垂直比例)
        const totalSize = Math.round(hexHeight * (5.0 / 3.0));

        // 4. 严格计算绝对坐标 (精确到像素)
        // 强制顶部留白为总高度的 1/5
        const paddingTop = Math.round(totalSize / 5.0); 
        // 强制水平居中
        const paddingLeft = Math.round((totalSize - hexWidth) / 2.0); 

        if (isVerbose) {
            console.log(`[*] 成功抠出六边形实体 (宽度: ${hexWidth}px, 高度: ${hexHeight}px)`);
            console.log(`[*] 新生成的正方形画布尺寸: ${totalSize}x${totalSize}px`);
            
            console.log(`[*] 绝对坐标强制贴图定位:`);
            console.log(`    -> 顶部精确留白 (Top): ${paddingTop}px (占总高度的 ${(paddingTop/totalSize*100).toFixed(2)}%)`);
            console.log(`    -> 实体占用高度 (Height): ${hexHeight}px (占总高度的 ${(hexHeight/totalSize*100).toFixed(2)}%)`);
            console.log(`    -> 底部剩余留白 (Bottom): ${totalSize - paddingTop - hexHeight}px (占总高度的 ${((totalSize - paddingTop - hexHeight)/totalSize*100).toFixed(2)}%)`);
            console.log(`    -> 左侧留白 (Left): ${paddingLeft}px`);
        }

        // 5. 创建纯白画布，并使用 top/left 绝对坐标强制粘贴
        const pipeline = sharp({
            create: {
                width: totalSize,
                height: totalSize,
                channels: 3,
                background: { r: 255, g: 255, b: 255 }
            }
        })
        .composite([{ 
            input: trimmedBuffer.data, 
            top: paddingTop,
            left: paddingLeft
        }]);

        const outLower = outputPath.toLowerCase();
        if (outLower.endsWith('.jpg') || outLower.endsWith('.jpeg')) {
            await pipeline
                .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
                .toFile(outputPath);
        } else {
            await pipeline.png().toFile(outputPath);
        }

        if (isVerbose) {
            console.log(`[+] 处理完成！图片已完美按比例保存至: ${outputPath}\n`);
        }

    } catch (error) {
        console.error(`[!] 处理图片时发生错误: ${error.message}`);
    }
}

processImage();