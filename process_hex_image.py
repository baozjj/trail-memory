#!/usr/bin/env python3
"""
将「纯白背景 + 平顶正六边形实体」规范为正方形输出。

流程：
  1. 识别实体像素，定位左右顶点 → 推断正六边形几何
  2. 按六边形轮廓裁切，只保留六边形内内容（外为透明）
  3. 生成正方形白底画布，六边形高 3/5、水平居中、顶边距顶 1/5

用法:
  python process_hex_image.py input.png -o output.png
  python process_hex_image.py input.png -o output.png --size 512
"""

from __future__ import annotations

import argparse
import math
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

HEX_HEIGHT_RATIO = math.sqrt(3)
WHITE_THRESHOLD = 250


@dataclass(frozen=True)
class FlatTopHex:
    """平顶正六边形（顶边、底边水平）。"""

    cx: float
    cy: float
    side: float

    @property
    def height(self) -> float:
        return self.side * HEX_HEIGHT_RATIO

    @property
    def width(self) -> float:
        return 2 * self.side

    @property
    def top(self) -> float:
        return self.cy - self.height / 2

    @property
    def bottom(self) -> float:
        return self.cy + self.height / 2

    @property
    def left(self) -> float:
        return self.cx - self.side

    @property
    def right(self) -> float:
        return self.cx + self.side

    def contains(self, x: float, y: float) -> bool:
        top, bottom, mid = self.top, self.bottom, self.cy
        if y < top or y > bottom:
            return False
        if y <= mid:
            t = (y - top) / (mid - top) if mid > top else 0.0
            half_w = self.side * (0.5 + 0.5 * t)
        else:
            t = (y - mid) / (bottom - mid) if bottom > mid else 0.0
            half_w = self.side * (1 - 0.5 * t)
        return abs(x - self.cx) <= half_w


def _is_background_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 16:
        return True
    return r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD


def _detect_flat_top_hex(img: Image.Image) -> FlatTopHex:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    min_x, max_x = w, -1
    fg_count = 0
    y_hist = [0] * h

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if not _is_background_pixel(r, g, b, a):
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                y_hist[y] += 1
                fg_count += 1

    if fg_count == 0 or max_x < 0:
        raise ValueError("未检测到六边形实体（图片可能全白或路径错误）")

    seen = 0
    median_target = fg_count // 2
    median_y = 0
    for y, count in enumerate(y_hist):
        seen += count
        if seen > median_target:
            median_y = y
            break

    left_x, left_y, left_dist = min_x, 0, float("inf")
    right_x, right_y, right_dist = max_x, 0, float("inf")

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if not _is_background_pixel(r, g, b, a):
                if x == min_x:
                    d = abs(y - median_y)
                    if d < left_dist:
                        left_dist, left_y = d, y
                if x == max_x:
                    d = abs(y - median_y)
                    if d < right_dist:
                        right_dist, right_y = d, y

    side_from_lr = (right_x - left_x) / 2
    side_from_span = (max_x - min_x + 1) / 2
    side = (side_from_lr + side_from_span) / 2
    if side <= 0:
        raise ValueError("六边形尺寸无效")

    return FlatTopHex(cx=(left_x + right_x) / 2, cy=(left_y + right_y) / 2, side=side)


def _extract_hexagon_only(img: Image.Image, hex_shape: FlatTopHex) -> Image.Image:
    """按六边形轮廓裁切，仅保留六边形内部像素。"""
    source = img.convert("RGBA")
    sw, sh = source.size
    src_px = source.load()

    crop_w = max(1, math.ceil(hex_shape.width))
    crop_h = max(1, math.ceil(hex_shape.height))
    out = Image.new("RGBA", (crop_w, crop_h), (0, 0, 0, 0))
    out_px = out.load()

    origin_x = hex_shape.left
    origin_y = hex_shape.top

    local_hex = FlatTopHex(cx=hex_shape.side, cy=hex_shape.height / 2, side=hex_shape.side)

    for ly in range(crop_h):
        for lx in range(crop_w):
            wx = origin_x + lx + 0.5
            wy = origin_y + ly + 0.5
            if not local_hex.contains(lx + 0.5, ly + 0.5):
                continue
            sx = int(wx)
            sy = int(wy)
            if 0 <= sx < sw and 0 <= sy < sh:
                out_px[lx, ly] = src_px[sx, sy]

    return out


def process_hex_image(
    input_path: Path,
    output_path: Path,
    *,
    size: int | None = None,
) -> Image.Image:
    source = Image.open(input_path)
    if size is None:
        size = max(source.size)
    if size <= 0:
        raise ValueError("输出边长必须为正整数")

    hex_shape = _detect_flat_top_hex(source)
    hex_only = _extract_hexagon_only(source, hex_shape)

    target_hex_height = 3 * size / 5
    scale = target_hex_height / hex_shape.height
    new_w = max(1, round(hex_only.width * scale))
    new_h = max(1, round(hex_only.height * scale))
    resized = hex_only.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    paste_x = (size - new_w) // 2
    paste_y = round(size / 5)
    canvas.paste(resized, (paste_x, paste_y), resized)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    result = canvas.convert("RGB")
    result.save(output_path, format="PNG", optimize=True)
    return result


def _expected_hex_metrics(size: int) -> dict[str, float]:
    hex_h = 3 * size / 5
    side = hex_h / HEX_HEIGHT_RATIO
    return {
        "margin_top_bottom": size / 5,
        "hex_height": hex_h,
        "hex_width": 2 * side,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="识别平顶正六边形 → 裁切实体 → 放入规范正方形画布。"
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("-o", "--output", type=Path, required=True)
    parser.add_argument("--size", type=int, default=None)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args(argv)

    if not args.input.is_file():
        print(f"错误: 找不到输入文件 {args.input}", file=sys.stderr)
        return 1

    try:
        out = process_hex_image(args.input, args.output, size=args.size)
    except (ValueError, OSError) as exc:
        print(f"错误: {exc}", file=sys.stderr)
        return 1

    s = out.size[0]
    print(f"已写入 {args.output} ({s}×{s})")
    if args.verbose:
        m = _expected_hex_metrics(s)
        print(
            f"  上下留白各 {m['margin_top_bottom']:.1f}px，"
            f"六边形高 {m['hex_height']:.1f}px、宽 {m['hex_width']:.1f}px"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
