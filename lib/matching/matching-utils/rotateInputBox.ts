import type { Box } from "lib/input-types"

export function rotateInputBox(box: Box, degrees: 0 | 90 | 180 | 270): Box {
  switch (degrees) {
    case 0:
      return box
    case 90:
      return {
        ...box,
        leftPinCount: box.bottomPinCount,
        rightPinCount: box.topPinCount,
        topPinCount: box.leftPinCount,
        bottomPinCount: box.rightPinCount,
      }
    case 180:
      return {
        ...box,
        leftPinCount: box.rightPinCount,
        rightPinCount: box.leftPinCount,
        topPinCount: box.bottomPinCount,
        bottomPinCount: box.topPinCount,
      }
    case 270:
      return {
        ...box,
        leftPinCount: box.topPinCount,
        rightPinCount: box.bottomPinCount,
        topPinCount: box.rightPinCount,
        bottomPinCount: box.leftPinCount,
      }
    default:
      return box
  }
}
