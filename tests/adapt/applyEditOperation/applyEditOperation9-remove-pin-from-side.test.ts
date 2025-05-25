import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"

test("remove pin from side", () => {
  const C = new CircuitBuilder()
  const U = C.chip().leftpins(3).rightpins(1) // Pins 1, 2 on left, Pin 3 on right
  U.pin(1).line(-1, 0).label()
  U.pin(2).line(-2, 0).label()
  U.pin(3).line(-2, 0).line(0, -1).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     1.2      U1
     1.0     ┌────────┐
     0.8     │        │
     0.6   A─┤1      4├
     0.4 B───┤2       │
     0.2 ┌───┤3       │
     0.0 │   └────────┘
    -0.2 │
    -0.4 │
    -0.6 │
    -0.8 C
    "
  `)

  applyEditOperation(C, {
    type: "remove_pin_from_side",
    chipId: U.chipId,
    side: "left",
    pinNumber: 2,
  })

  // expect(U.leftPinCount).toBe(3)
  // expect(U.totalPinCount).toBe(4) // 3 left + 1 right

  // Expect pin 1, then new pin, then pin 2 (now pin 3)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     1.0      U1
     0.8     ┌────────┐
     0.6     │        │
     0.4   A─┤1      3├
     0.2 ┌───┤2       │
     0.0 │   └────────┘
    -0.2 │
    -0.4 │
    -0.6 │
    -0.8 C
    "
  `)
})
