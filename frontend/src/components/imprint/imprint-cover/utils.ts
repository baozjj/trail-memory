/** 正六边形（顶边、底边水平）几何常量，边长 s = 50，总宽 100 */
const SIDE = 50
const WIDTH = SIDE * 2
const HEIGHT = SIDE * Math.sqrt(3)
const MID_Y = HEIGHT / 2

/** SVG viewBox 尺寸 */
export const flatHexViewBox = `0 0 ${WIDTH} ${HEIGHT}`

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

/** CSS aspect-ratio：宽 / 高 */
export const flatHexAspectRatio = `${WIDTH} / ${HEIGHT}`
