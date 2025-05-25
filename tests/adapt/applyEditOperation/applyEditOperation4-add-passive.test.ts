import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
test("add passive to pin", () => {
  const C = new CircuitBuilder()
  const U = C.chip().leftpins(1)
  U.pin(1).line(-1, 0)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
           0.0     
     0.6   U1
     0.4   ┌────┐
     0.2 ──┤1   │
     0.0   └────┘
    "
  `)
  applyEditOperation(C, {
    type: "add_passive_to_pin",
    chipId: U.chipId,
    pinNumber: 1,
  })
  expect(C.chips.length).toBe(2) // original + passive
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     0.6     U1
     0.4     ┌────┐
     0.2 R2──┤1   │
     0.0     └────┘
    "
  `)
})
