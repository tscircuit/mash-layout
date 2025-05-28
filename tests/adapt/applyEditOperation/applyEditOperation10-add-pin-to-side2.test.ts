import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"

test("add pin to side", () => {
  const C = new CircuitBuilder()
  const U = C.chip().leftpins(2).rightpins(1) // Pins 1, 2 on left, Pin 3 on right
  U.pin(1).line(-1, 0).label()
  U.pin(2).line(-2, 0).line(0, -1).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     0.8     U1
     0.6     ┌────┐
     0.4   A─┤1  3├
     0.2 ┌───┤2   │
     0.0 │   └────┘
    -0.2 │
    -0.4 │
    -0.6 │
    -0.8 B
    "
  `)

  applyEditOperation(C, {
    type: "add_pin_to_side",
    chipId: U.chipId,
    side: "left",
    betweenPinNumbers: [0, 1],
  })

  // Expect pin 1, then new pin, then pin 2 (now pin 3)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     1.0     U1
     0.8     ┌────┐
     0.6     ┤1  4├
     0.4   A─┤2   │
     0.2 ┌───┤3   │
     0.0 │   └────┘
    -0.2 │
    -0.4 │
    -0.6 │
    -0.8 B
    "
  `)

  expect(U.leftPinCount).toBe(3)
  expect(U.totalPinCount).toBe(4)
})
