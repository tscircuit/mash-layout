import type { GraphicsObject } from "graphics-debug"
import { CircuitLayoutJson } from "lib/output-types"
import { InteractiveGraphics } from "graphics-debug/react"

export const CircuitLayoutDebugger = ({
  circuitLayout,
}: {
  circuitLayout: CircuitLayoutJson
}) => {
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
    // Estimate box size based on pin counts
    const width = Math.max(
      2,
      Math.max(box.leftPinCount, box.rightPinCount) * 0.5,
    )
    const height = Math.max(
      1,
      Math.max(box.topPinCount, box.bottomPinCount) * 0.5,
    )

    graphics.rects.push({
      center: {
        x: box.centerX,
        y: box.centerY,
      },
      width: width,
      height: height,
      color:
        box.boxId.startsWith("R") ||
        box.boxId.startsWith("C") ||
        box.boxId.startsWith("L")
          ? "orange"
          : "lightblue",
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
        fill: "red",
        label: `Pin ${pin.pinNumber}`,
      })
    }
  }

  // Draw paths as lines
  for (const path of circuitLayout.paths) {
    if (path.points.length >= 2) {
      graphics.lines.push({
        points: path.points,
        strokeColor: "black",
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
      fill: "green",
      label: junction.junctionId,
    })
  }

  // Draw net labels as points with labels
  for (const netLabel of circuitLayout.netLabels) {
    graphics.points.push({
      x: netLabel.x,
      y: netLabel.y,
      color: "purple",
      label: `${netLabel.netId} (${netLabel.anchorPosition})`,
    })
  }

  return <InteractiveGraphics graphics={graphics} />
}
