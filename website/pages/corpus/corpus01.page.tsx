import { PipelineDebugger } from "website/components/PipelineDebugger"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"

export const corpus1Code = `
export default () => (
  <board width="10mm" height="10mm" pcbDisabled routingDisabled>
    <chip
      name="U1"
      footprint="soic4"
      connections={{
        pin1: ".R1 .pin1",
        pin4: "net.VCC"
      }}
    />
    <resistor
      resistance="1k"
      footprint="0402"
      name="R1"
      schRotation="-90deg"
      schX={-2}
      connections={{
        pin2: "net.GND",
      }}
    />
  </board>
)

`

export default () => (
  <PipelineDebugger
    tscircuitCode={corpus1Code}
    templateFns={[() => circuitBuilderFromLayoutJson(corpus1LayoutJson as any)]}
  />
)
