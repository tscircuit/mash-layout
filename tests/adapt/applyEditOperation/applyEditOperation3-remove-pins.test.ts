import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
test("remove pins from side", () => {
  const C = new CircuitBuilder()
  const U = C.chip().leftpins(3).rightpins(1)

  U.pin(1).line(-2, 0).label()
  U.pin(3).line(-2, 0).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     1.0     U1
     0.8     ┌────┐
     0.6 A───┤1  4├
     0.4     ┤2   │
     0.2 B───┤3   │
     0.0     └────┘
    "
  `)

  applyEditOperation(C, {
    type: "remove_pin_from_side",
    chipId: U.chipId,
    side: "left",
    pinNumber: 1,
  })
  expect(U.leftPinCount).toBe(2)
  expect(U.totalPinCount).toBe(3)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     0.8     U1
     0.6     ┌────┐
     0.4     │   3├
     0.2     ┤1   │
     0.0     └────┘
    -0.2 B
    "
  `)
})
