import sharp from "sharp";

export interface ProcessHexImageOptions {
  /** 白底裁剪容差，越大越能去掉边缘浅灰阴影 */
  threshold?: number;
}

export interface ProcessHexImageResult {
  buffer: Buffer;
  hexWidth: number;
  hexHeight: number;
  canvasSize: number;
}

/**
 * 将白底六边形原图处理为标准正方形封面（1:3:1 垂直留白比例）。
 * 逻辑与仓库根目录 process_hex_image.mjs 一致。
 */
export async function processHexImageBuffer(
  input: Buffer,
  options: ProcessHexImageOptions = {},
): Promise<ProcessHexImageResult> {
  const trimThreshold = options.threshold ?? 50;

  const trimmedBuffer = await sharp(input)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .trim({
      background: { r: 255, g: 255, b: 255 },
      threshold: trimThreshold,
    })
    .toBuffer({ resolveWithObject: true });

  const hexWidth = trimmedBuffer.info.width;
  const hexHeight = trimmedBuffer.info.height;
  const totalSize = Math.round(hexHeight * (5.0 / 3.0));
  const paddingTop = Math.round(totalSize / 5.0);
  const paddingLeft = Math.round((totalSize - hexWidth) / 2.0);

  const buffer = await sharp({
    create: {
      width: totalSize,
      height: totalSize,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      {
        input: trimmedBuffer.data,
        top: paddingTop,
        left: paddingLeft,
      },
    ])
    .png()
    .toBuffer();

  return {
    buffer,
    hexWidth,
    hexHeight,
    canvasSize: totalSize,
  };
}
