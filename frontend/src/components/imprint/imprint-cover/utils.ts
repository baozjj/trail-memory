/** 正六边形（顶边、底边水平）几何常量，边长 s = 50，总宽 100 */
const SIDE = 50
const WIDTH = SIDE * 2
const HEIGHT = SIDE * Math.sqrt(3)
const MID_Y = HEIGHT / 2

/** 描边预留边距，避免 viewBox 裁切导致顶/底水平边看起来更细 */
export const HEX_STROKE_WIDTH = 1.25
const VIEW_PAD = HEX_STROKE_WIDTH + 1

/** 六顶点：顶边水平、底边水平，六边等长 */
export const flatHexPoints = [
  [SIDE / 2, 0],
  [(SIDE * 3) / 2, 0],
  [WIDTH, MID_Y],
  [(SIDE * 3) / 2, HEIGHT],
  [SIDE / 2, HEIGHT],
  [0, MID_Y],
]
  .map(([x, y]) => `${x},${y}`)
  .join(' ')

/** 带边距的 viewBox，保证描边四边完整绘制 */
export const flatHexViewBox = `${-VIEW_PAD} ${-VIEW_PAD} ${WIDTH + VIEW_PAD * 2} ${HEIGHT + VIEW_PAD * 2}`

/** CSS aspect-ratio：宽 / 高 */
export const flatHexAspectRatio = `${WIDTH} / ${HEIGHT}`
