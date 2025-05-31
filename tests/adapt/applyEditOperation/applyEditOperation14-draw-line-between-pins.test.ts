import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { DrawLineBetweenPinsOp } from "lib/adapt/EditOperation"

test("applyEditOperation14 draws line between pins using pathfinding", () => {
  const circuit = new CircuitBuilder()

  // Create two separate chips
  const chip1 = circuit.chip().leftpins(2).rightpins(2).at(-3, 0)
  const chip2 = circuit.chip().leftpins(2).rightpins(2).at(3, 0)

  // Apply operation to draw line from chip1 pin 4 to chip2 pin 1
  const operation: DrawLineBetweenPinsOp = {
    type: "draw_line_between_pins",
    fromChipId: "U1",
    fromPinNumber: 4,
    toChipId: "U2",
    toPinNumber: 1,
    netName: "connection",
  }

  applyEditOperation(circuit, operation)

  expect(`\n${circuit.toString()}\n`).toMatchInlineSnapshot(`
    "
               0.0         5.0 
     1.0     ┌───────┐
     0.8 U1  │       U2
     0.6 ┌────┐      ┌────┐
     0.4 ┤1  4├      ┤1  4├
     0.2 ┤2  3├      ┤2  3├
     0.0 └────┘      └────┘
    "
  `)
})
