import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"

test("adaptTemplateToTarget3 removes extra chip when target has fewer chips", () => {
  /* target circuit (single chip) ------------------------------------- */
  const target = new CircuitBuilder()
  const tU1 = target.chip().leftpins(2).rightpins(2)
  tU1.pin(1).line(-4, 0).line(0, -1).passive().line(0, -2).label()

  /* template circuit (no passive, no label) --------------------------- */
  const template = new CircuitBuilder()
  const eU1 = template.chip().leftpins(2).rightpins(2).at(0, 0)

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
                 0.0      
     0.8         U1
     0.6         ┌─────┐
     0.4 ┌───────┤1   4├
     0.2 │       ┤2   3├
     0.0 │       └─────┘
    -0.2 │
    -0.4 │
    -0.6 ┴
    -0.8
    -1.0 R2
    -1.2
    -1.4
    -1.6 ┬
    -1.8 │
    -2.0 │
    -2.2 │
    -2.4 │
    -2.6 │
    -2.8 │
    -3.0 │
    -3.2 │
    -3.4 │
    -3.6 A
    "
  `)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0      
     0.8 U1
     0.6 ┌─────┐
     0.4 ┤1   4├
     0.2 ┤2   3├
     0.0 └─────┘
    "
  `)

  /* run adaptation --------------------------------------------------- */
  const { appliedOperations, outputTemplate } = adaptTemplateToTarget({
    template,
    target: target.getNetlist(),
  })

  expect(appliedOperations).toMatchInlineSnapshot(`[]`)

  /* verify adaptation result ----------------------------------------- */
  expect(`\n${outputTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0      
     0.8 U1
     0.6 ┌─────┐
     0.4 ┤1   4├
     0.2 ┤2   3├
     0.0 └─────┘
    "
  `)
})
