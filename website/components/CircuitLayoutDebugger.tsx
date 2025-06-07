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
    title: "",
  }

  return <InteractiveGraphics graphics={graphics} />
}
