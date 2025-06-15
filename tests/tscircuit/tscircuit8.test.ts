import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "./testTscircuitCodeForLayout"
import { TEMPLATE_FNS } from "templates/index"
import { CORPUS_TEMPLATE_FNS } from "lib/corpus"

const tscircuitCode = `
export default () => (
  <board width="10mm" height="10mm">
    <resistor
      resistance="1k"
      footprint="0402"
      name="R1"
      connections={{pin2: "net.VCC"}}
      schX={3}
      pcbX={3}
    />
    <capacitor
      capacitance="1000pF"
      footprint="0402"
      name="C1"
      schX={-3}
      pcbX={-3}
      connections={{
        pin2: "net.GND"
      }}
    />
    <trace from=".R1 > .pin1" to=".C1 > .pin1" />
  </board>
)
`

test("tscircuit8 corpus template layout", async () => {
  const { laidOutSchematicSvg } = await testTscircuitCodeForLayout(
    tscircuitCode,
    {
      templateFns: [...CORPUS_TEMPLATE_FNS, ...TEMPLATE_FNS],
    },
  )

  expect(laidOutSchematicSvg).toMatchSvgSnapshot(import.meta.path)
})
