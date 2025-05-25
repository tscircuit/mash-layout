import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"

test("adaptTemplateToTarget2 adds missing labels and removes extra labels", () => {
  /* target circuit --------------------------------------------------- */
  const target = new CircuitBuilder()
  const gU1 = target.chip().leftpins(2).rightpins(2)
  gU1.pin(1).line(-2, 0).label()

  /* template circuit (one pin short) --------------------------------- */
  const template = new CircuitBuilder()
  const eU1 = template.chip().leftpins(2).rightpins(2)
  eU1.pin(4).line(2, 0).label()

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     1.0      U1
     0.8     ┌────────┐
     0.6     │        │
     0.4 A───┤1      4├
     0.2     ┤2      3├
     0.0     └────────┘
    "
  `)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0  
     1.0  U1
     0.8 ┌────────┐
     0.6 │        │
     0.4 ┤1      4├──A
     0.2 ┤2      3├
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
        "chipId": "U1",
        "pinNumber": 1,
        "type": "add_label_to_pin",
      },
      {
        "chipId": "U1",
        "pinNumber": 4,
        "type": "clear_pin",
      },
    ]
  `)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     1.0      U1
     0.8     ┌────────┐
     0.6     │        │
     0.4 B───┤1      4├
     0.2     ┤2      3├
     0.0     └────────┘
    "
  `)
})
