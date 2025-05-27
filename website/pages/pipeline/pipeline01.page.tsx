import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import React from "react"
import { PipelineDebugger } from "website/components/PipelineDebugger"

export default () => (
  <PipelineDebugger
    tscircuitCode={`
      import { sel } from "tscircuit"

      export default () => (
        <board routingDisabled>
          <chip
            name="U1"
            footprint="soic6"
            pinLabels={{
              pin1: "IN",
              pin2: "EN",
              pin3: "GND",
              pin6: "OUT"
            }}
            connections={{ pin1: sel.net.VIN, pin2: sel.net.EN, pin3: sel.net.GND }}
          />
          <resistor
            name="R3"
            schX={-3}
            schRotation="90deg"
            resistance="1k"
            footprint="0402"
            connections={{ pin1: sel.net.EN, pin2: sel.net.VIN }}
          />
          <capacitor
            name="C1"
            schX={-5}
            schRotation="-90deg"
            capacitance="1uF"
            footprint="0402"
            connections={{ pin1: sel.net.VIN, pin2: sel.net.GND }}
          />
          <capacitor
            name="C2"
            schX={3}
            schRotation="-90deg"
            capacitance="1uF"
            footprint="0402"
            connections={{pin1: sel.net.V3_3, pin2: sel.net.GND}}
          />
        </board> 
    )
      `}
  />
)
