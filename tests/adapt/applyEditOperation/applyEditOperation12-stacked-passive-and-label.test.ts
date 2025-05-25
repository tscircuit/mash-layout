import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"
import { applyEditOperation } from "lib/adapt/applyEditOperation"

test("applyEditOperation12 stacked passive and label", () => {
  /* target circuit (single chip) ------------------------------------- */
  const target = new CircuitBuilder()
  const U1 = target.chip().leftpins(2).rightpins(2)

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     0.8 U1
     0.6 ┌────────┐
     0.4 ┤1      4├
     0.2 ┤2      3├
     0.0 └────────┘
    "
  `)

  applyEditOperation(target, {
    type: "add_passive_to_pin",
    chipId: U1.chipId,
    pinNumber: 1,
  })

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
               0.0         
     0.8       U1
     0.6       ┌────────┐
     0.4 R2────┤1      4├
     0.2       ┤2      3├
     0.0       └────────┘
    "
  `)

  applyEditOperation(target, {
    type: "add_label_to_pin",
    chipId: U1.chipId,
    pinNumber: 1,
  })

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
                 0.0         
     0.8         U1
     0.6         ┌────────┐
     0.4 A─R2────┤1      4├
     0.2         ┤2      3├
     0.0         └────────┘
    "
  `)
})
