import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"

test("applyEditOperation1", () => {
  const C = new CircuitBuilder()

  const U1 = C.chip().leftpins(1).rightpins(1)

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     0.6 U1
     0.4 ┌────────┐
     0.2 ┤1      2├
     0.0 └────────┘
    "
  `)

  applyEditOperation(C, {
    type: "add_label_to_pin",
    chipId: U1.chipId,
    pinNumber: 1,
  })

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     0.6     U1
     0.4     ┌────────┐
     0.2 A───┤1      2├
     0.0     └────────┘
    "
  `)

  applyEditOperation(C, {
    type: "add_label_to_pin",
    chipId: U1.chipId,
    pinNumber: 2,
  })

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         5.0  
     0.6     U1
     0.4     ┌────────┐
     0.2 A───┤1      2├──B
     0.0     └────────┘
    "
  `)
})
