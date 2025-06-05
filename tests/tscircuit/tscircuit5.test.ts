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
     1.0       U1                J2
     0.8 V     ┌─────┐   V       ┌────┐
     0.6 ├─┬───┤1   6├───┴─┬─────┤1   │
     0.4 │ ┴   ┤2   5├───┐ │   ┌─┤2   │
     0.2 ┴   ┌─┤3   4├─┐ ┴ ┴   │ └────┘
     0.0     ┴ └─────┘ │       │
    -0.2   D4          │ R6    │
    -0.4 C3  R5        │   C4  │
    -0.6   ┬           │       │
    -0.8 ┬ │           │ ┬ ┬   │
    -1.0 G │ ┬         └─┴─┴───┤
    -1.2   └─┘                 G
    "
  `)

  expect(result.laidOutSchematicSvg).toMatchSvgSnapshot(import.meta.path)
})
