import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import React from "react"
import { PipelineDebugger } from "website/components/PipelineDebugger"

export default () => (
  <PipelineDebugger
    tscircuitCode={`
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    {/* MCP73831 LiPo Charge Controller */}
    <chip
      name="U1"
      manufacturerPartNumber="MCP73831"
      footprint="soic6"
      pinLabels={{
        pin1: "VIN",
        pin3: "STAT",
        pin4: "VSS",
        pin5: "PROG",
        pin6: "VBAT"
      }}      
      connections={{VSS: sel.net.GND}}
    />

    <capacitor
      capacitance="4.7uF"
      name="C3"
      schX={-4}
      schY={-1}
      
      schRotation="270deg"
      connections={{
        pin1: sel.U1.VIN,
        pin2: sel.net.GND,
      }}
    />

    {/* Battery Output Capacitor */}
    <capacitor
      capacitance="4.7uF"
      name="C4"
      schX={3.5}
      schY={-1}
      schRotation="270deg"
      connections={{
        pin1: sel.U1.VBAT,
        pin2: sel.net.GND,
      }}
    />

    {/* Status LED */}
    <diode
      name="D1"
      footprint="0603"
      schX={-3}
      schY={-2}
      schRotation="-90deg"
      connections={{
        anode: sel.U1.VIN,
        cathode: sel.R5.pin2,
      }}
    />
    <resistor
      resistance="1k"
      name="R5"
      schX={-2}
      schY={-2}
      schRotation="270deg"
      connections={{
        pin1: sel.U1.STAT
      }}
    />
    <resistor
      resistance="2.0k"
      name="R6"
      schX={2}
      schY={-1}
      schRotation="270deg"
      connections={{
        pin1: sel.U1.PROG,
        pin2: sel.net.GND,
      }}
    />
    <chip
      footprint="pinrow2"
      name="J2"
      pinLabels={{
        pin1: "POS",
        pin2: "NEG",
      }}
      schX={6}
      schY={0}
      schPinArrangement={{
        leftSide: {
          direction: "top-to-bottom",
          pins: ["POS", "NEG"],
        },
      }}
      connections={{
        "POS": sel.U1.VBAT,
        "NEG": sel.net.GND,
      }}
    />
  </board>
)



      `}
  />
)
