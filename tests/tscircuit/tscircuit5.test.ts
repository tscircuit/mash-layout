import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "./testTscircuitCodeForLayout"

test("tscircuit5", async () => {
  const result = await testTscircuitCodeForLayout(`
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
      connections={{ pin1: sel.net.IN, pin2: sel.net.EN, pin3: sel.net.GND }}
    />
    <resistor
      name="R3"
      resistance="1k"
      footprint="0402"
      connections={{ pin1: sel.net.EN, pin2: sel.net.VIN }}
    />
    <capacitor
      name="C1"
      capacitance="1uF"
      footprint="0402"
      connections={{ pin1: sel.net.VIN, pin2: sel.net.GND }}
    />
    <capacitor
      name="C2"
      capacitance="1uF"
      footprint="0402"
      connections={{pin1: sel.net.V3_3, pin2: sel.net.GND}}
    />
  </board>
)`)

  expect(`\n${result.matchedTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0         
     0.8 U1                  U2
     0.6 ┌────────┐          ┌────────┐
     0.4 ┤1      4├──────────┤1      2├
     0.2 ┤2      3├          └────────┘
     0.0 └────────┘
    "
  `)

  expect(result.laidOutSchematicSvg).toMatchSvgSnapshot(import.meta.path)
})
