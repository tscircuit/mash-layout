import type { GraphicsObject } from "graphics-debug"
import { CircuitLayoutJson } from "lib/output-types"
import { InteractiveGraphics } from "graphics-debug/react"
import { convertCircuitLayoutToGraphics } from "lib/utils/convertCircuitLayoutToGraphics"

export const CircuitLayoutDebugger = ({
  circuitLayout,
}: {
  circuitLayout: CircuitLayoutJson
}) => {
  const graphics: Required<GraphicsObject> =
    convertCircuitLayoutToGraphics(circuitLayout)

  return <InteractiveGraphics graphics={graphics} />
}
