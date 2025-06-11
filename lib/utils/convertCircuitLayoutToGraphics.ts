import { GraphicsObject } from "graphics-debug"
import { CircuitLayoutJson } from "lib/output-types"

// Helper to convert color names to rgba with 0.8 opacity
const colorToRgba = (color: string): string => {
  switch (color) {
    case "orange":
      return "rgba(255,165,0,0.8)"
    case "lightblue":
      return "rgba(173,216,230,0.8)"
    case "red":
      return "rgba(255,0,0,0.8)"
    case "black":
      return "rgba(0,0,0,0.8)"
    case "green":
      return "rgba(0,128,0,0.8)"
    case "purple":
      return "rgba(128,0,128,0.8)"
    default:
      // fallback: just return the color as-is (could be already rgba)
      return color
  }
}

export const convertCircuitLayoutToGraphics = (
  circuitLayout: CircuitLayoutJson,
) => {
  const graphics: Required<GraphicsObject> = {
    rects: [],
    lines: [],
    circles: [],
    points: [],
    coordinateSystem: "cartesian",
    title: "Circuit Layout Visualization",
  }

  // Draw boxes as rectangles
  for (const box of circuitLayout.boxes) {
    // Detect if this is a passive component (total pins = 2)
    const totalPins =
      box.leftPinCount +
      box.rightPinCount +
      box.topPinCount +
      box.bottomPinCount
    const isPassive = totalPins === 2

    let width: number
    let height: number

    if (isPassive) {
      // Use ChipBuilder's passive sizing logic
      const isHorizontal = box.leftPinCount > 0 || box.rightPinCount > 0
      const defaultPassiveWidth = 1
      const defaultPassiveHeight = 0.2

      width = isHorizontal ? defaultPassiveWidth : defaultPassiveHeight
      height = isHorizontal ? defaultPassiveHeight : defaultPassiveWidth
    } else {
      // Use ChipBuilder's non-passive sizing logic
      const defaultChipWidth = 2
      const defaultSingleSidedChipWidth = 2
      const defaultLeftRightChipWidth = 2.8
      const defaultPinSpacing = 0.2

      // Check if chip has pins on only one side
      const sideCount = [
        box.leftPinCount > 0 ? 1 : 0,
        box.rightPinCount > 0 ? 1 : 0,
        box.topPinCount > 0 ? 1 : 0,
        box.bottomPinCount > 0 ? 1 : 0,
      ].reduce((sum, count) => sum + count, 0)

      if (sideCount === 1) {
        width = defaultSingleSidedChipWidth
      } else {
        const hasLeftRightPins = box.leftPinCount > 0 && box.rightPinCount > 0
        if (
          hasLeftRightPins &&
          box.topPinCount === 0 &&
          box.bottomPinCount === 0
        ) {
          width = defaultLeftRightChipWidth
        } else {
          width = defaultChipWidth
        }
      }

      height =
        Math.max(box.leftPinCount, box.rightPinCount) * defaultPinSpacing +
        defaultPinSpacing * 2
    }

    graphics.rects.push({
      center: {
        x: box.centerX,
        y: box.centerY,
      },
      width: width,
      height: height,
      fill:
        box.boxId.startsWith("R") ||
        box.boxId.startsWith("C") ||
        box.boxId.startsWith("L")
          ? colorToRgba("orange")
          : colorToRgba("lightblue"),
      label: box.boxId,
    })

    // Draw pins as small circles
    for (const pin of box.pins) {
      graphics.circles.push({
        center: {
          x: pin.x,
          y: pin.y,
        },
        radius: 0.1,
        fill: colorToRgba("red"),
        label: `Pin ${pin.pinNumber}`,
      })
    }
  }

  // Draw paths as lines
  for (const path of circuitLayout.paths) {
    if (path.points.length >= 2) {
      graphics.lines.push({
        points: path.points,
        strokeColor: colorToRgba("black"),
        strokeWidth: 0.05,
      })
    }
  }

  // Draw junctions as larger circles
  for (const junction of circuitLayout.junctions) {
    graphics.circles.push({
      center: {
        x: junction.x,
        y: junction.y,
      },
      radius: 0.15,
      fill: colorToRgba("green"),
      label: junction.junctionId,
    })
  }

  // Draw net labels as points with labels
  for (const netLabel of circuitLayout.netLabels) {
    graphics.points.push({
      x: netLabel.x,
      y: netLabel.y,
      color: colorToRgba("purple"),
      label: `${netLabel.netId} (${netLabel.anchorPosition})`,
    })
  }
  return graphics
}
