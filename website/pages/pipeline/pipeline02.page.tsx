import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import React from "react"
import { PipelineDebugger } from "website/components/PipelineDebugger"

export default () => (
  <PipelineDebugger
    tscircuitCode={`
      import { sel } from "tscircuit"

export default () => (
  <board>
    <chip
      footprint="pinrow7"
      name="J1"
      pinLabels={{
        pin7: "VBUS",
        pin6: "DP",
        pin5: "DM",
        pin4: "CC1",
        pin3: "CC2",
        pin2: "SHLD",
        pin1: "GND",
      }}
      schPinArrangement={{
        rightSide: {
          direction: "bottom-to-top",
          pins: ["VBUS", "DP", "DM", "CC1", "CC2", "SHLD", "GND"],
        },
      }}
      connections={{
        GND: sel.net.GND,
        SHLD: sel.net.SHLD,
        VBUS: sel.net.V_USB
      }}
    />
    <resistor
      resistance="22"
      name="R9"
      schX={3}
      schY={1}
      connections={{
        pin1: sel.J1.DP,
        pin2: sel.net.DP,
      }}
    />
    <resistor
      resistance="22"
      name="R10"
      schX={3}
      schY={0.2}
      connections={{
        pin1: sel.J1.DM,
        pin2: sel.net.GND
      }}
    />
    <resistor
      resistance="5.1k"
      name="R1"
      schX={2}
      schY={-2}
      schRotation="270deg"
      connections={{ pin2: sel.net.DM, pin1: sel.J1.CC1 }}
    />
    <resistor
      resistance="5.1k"
      name="R2"
      footprint="0402"
      schX={3}
      schY={-2}
      schRotation="270deg"
      connections={{
        pin1: sel.J1.CC2,
        pin2: sel.net.GND,
      }}
    />
  </board>
)

      `}
  />
)
