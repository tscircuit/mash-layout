import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"

test("add pin to side", () => {
  const C = new CircuitBuilder()
  const U = C.chip().leftpins(1).rightpins(2)
  U.pin(2).line(2, 0).label()
  U.pin(3).line(2, 0).line(0, 1).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0  
     1.4             B
     1.2             │
     1.0 U1          │
     0.8 ┌────────┐  │
     0.6 │        │  │
     0.4 ┤1      3├──┘
     0.2 │       2├──A
     0.0 └────────┘
    "
  `)

  applyEditOperation(C, {
    type: "add_pin_to_side",
    chipId: U.chipId,
    side: "right",
    betweenPinNumbers: [3, 4],
  })

  // Expect pin 1, then new pin, then pin 2 (now pin 3)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0  
     1.4             B
     1.2 U1          │
     1.0 ┌────────┐  │
     0.8 │        │  │
     0.6 ┤1      4├  │
     0.4 │       3├──┘
     0.2 │       2├──A
     0.0 └────────┘
    "
  `)

  expect(U.leftPinCount).toBe(1)
  expect(U.totalPinCount).toBe(4)
})
