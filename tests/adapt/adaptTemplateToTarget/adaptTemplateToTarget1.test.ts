import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"

test("adaptTemplateToTarget adds missing pins on a side", () => {
  /* target circuit --------------------------------------------------- */
  const target = new CircuitBuilder()
  target.chip().leftpins(2).rightpins(2)

  /* template circuit (one pin short) --------------------------------- */
  const template = new CircuitBuilder()
  template.chip().leftpins(1).rightpins(1)

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     1.0 U1
     0.8 ┌────────┐
     0.6 │        │
     0.4 ┤1      4├
     0.2 ┤2      3├
     0.0 └────────┘
    "
  `)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     0.8 U1
     0.6 ┌────────┐
     0.4 │        │
     0.2 ┤1      2├
     0.0 └────────┘
    "
  `)

  /* run adaptation --------------------------------------------------- */
  const { appliedOperations } = adaptTemplateToTarget({
    template,
    target: target.getNetlist(),
  })

  expect(appliedOperations).toMatchInlineSnapshot(`
    [
      {
        "betweenPinNumbers": [
          0,
          1,
        ],
        "chipId": "U1",
        "side": "left",
        "type": "add_pin_to_side",
      },
      {
        "betweenPinNumbers": [
          3,
          4,
        ],
        "chipId": "U1",
        "side": "right",
        "type": "add_pin_to_side",
      },
    ]
  `)

  /* assertions ------------------------------------------------------- */
  expect(template.chips[0]!.leftPinCount).toBe(2) // pin was added
  expect(appliedOperations.length).toBe(2)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     1.0 U1
     0.8 ┌────────┐
     0.6 │        │
     0.4 ┤1      4├
     0.2 ┤2      3├
     0.0 └────────┘
    "
  `)
})
