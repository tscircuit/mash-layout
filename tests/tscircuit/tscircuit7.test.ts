import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "./testTscircuitCodeForLayout"

test("tscircuit7", async () => {
  const tscircuitCode = `
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
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
        SHLD: sel.net.GND,
        VBUS: sel.net.VUSB
      }}
    />
    <resistor
      resistance="22"
      name="R10"
      schX={3.4}
      schY={0.2}
      connections={{
        pin1: sel.J1.DM,
        pin2: sel.net.DM
      }}
    />
    <resistor
      resistance="5.1k"
      name="R1"
      schX={2}
      schY={-2}
      schRotation="270deg"
      connections={{ pin2: sel.net.GND, pin1: sel.J1.CC2 }}
    />
    <resistor
      resistance="5.1k"
      name="R2"
      footprint="0402"
      schX={3}
      schY={-2}
      schRotation="270deg"
      connections={{
        pin1: sel.J1.CC1,
        pin2: sel.net.GND,
      }}
    />
  </board>
)
  `

  const {
    originalCircuitJson,
    laidOutCircuitJson,
    readableNetlist,
    matchedTemplate,
    adaptedTemplate,
    originalSchematicSvg,
    laidOutSchematicSvg,
  } = await testTscircuitCodeForLayout(tscircuitCode)

  expect(
    `\nMatched Template:\n${matchedTemplate.toString()}\n`,
  ).toMatchInlineSnapshot(`
    "
    Matched Template:
         0.0         5.0      
     2.4         V
     2.2         │
     2.0         │
     1.8 J1      │
     1.6 ┌────┐  │ ┌───R9P
     1.4 │   7├──┘ │
     1.2 │   6├────┘
     1.0 │   5├────────R0M
     0.8 │   4├────────┐
     0.6 │   3├────┐   │
     0.4 │   2├┐   │   │
     0.2 │   1├●   ┴   ┴
     0.0 └────┘│
    -0.2       │   R1  R2
    -0.4       │
    -0.6       │
    -0.8       │   ┬   ┬
    -1.0       │   │   │
    -1.2       │   │   │
    -1.4       │   │   │
    -1.6       │   │   │
    -1.8       G   G   G
    "
  `)

  expect(
    `\nAdapted Template:\n${adaptedTemplate.toString()}\n`,
  ).toMatchInlineSnapshot(`
    "
    Adapted Template:
         0.0         5.0      
     2.4         V
     2.2         │
     2.0         │
     1.8 J1      │     ┌─┐
     1.6 ┌────┐  │     │ │
     1.4 │   7├──┘     │ │
     1.2 │   6├        │ │
     1.0 │   5├────┬───R1M
     0.8 │   4├────┼───┤
     0.6 │   3├────┤   │
     0.4 │   2├┐   │   │
     0.2 │   1├●   ┴───┴
     0.0 └────┘│   │   │
    -0.2       │   R1  R2
    -0.4       │   │   │
    -0.6       │   │   │
    -0.8       │   ┬   ┬
    -1.0       │   │   │
    -1.2       │   │   │
    -1.4       │   │   │
    -1.6       │   │   │
    -1.8       G   G   G
    "
  `)

  expect(originalSchematicSvg).toMatchSvgSnapshot(
    import.meta.path,
    "tscircuit7-original",
  )
  expect(laidOutSchematicSvg).toMatchSvgSnapshot(
    import.meta.path,
    "tscircuit7-layout",
  )
})
