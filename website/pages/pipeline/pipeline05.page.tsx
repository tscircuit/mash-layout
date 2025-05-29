import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import React from "react"
import { PipelineDebugger } from "website/components/PipelineDebugger"

export const pipeline05Code = `
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    <chip
      name="U1"
      manufacturerPartNumber="I2C_SENSOR"
      footprint="soic4"
      pinLabels={{
        pin1: "SCL",
        pin2: "SDA",
        pin3: "VCC",
        pin4: "GND"
      }}
      schPinArrangement={{
        leftSide: {
          direction: "top-to-bottom",
          pins: ["SCL", "SDA", "VCC", "GND"],
        },
      }}
      connections={{
        SCL: sel.net.SCL,
        SDA: sel.net.SDA,
        VCC: sel.net.V3_3,
        GND: sel.net.GND,
      }}
    />
  </board>
)
`

export default () => <PipelineDebugger tscircuitCode={pipeline05Code} />
