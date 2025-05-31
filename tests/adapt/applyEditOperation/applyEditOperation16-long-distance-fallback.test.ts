import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { DrawLineBetweenPinsOp } from "lib/adapt/EditOperation"

test("applyEditOperation16 falls back to heuristic routing for long distances", () => {
  const circuit = new CircuitBuilder()

  // Create two chips very far apart (distance > 10 units)
  const chip1 = circuit.chip().leftpins(1).rightpins(1).at(-8, 0)
  const chip2 = circuit.chip().leftpins(1).rightpins(1).at(8, 0)

  // Apply operation to draw line from chip1 to chip2 (distance = 16 units)
  const operation: DrawLineBetweenPinsOp = {
    type: "draw_line_between_pins",
    fromChipId: "U1",
    fromPinNumber: 2, // Right pin of chip1
    toChipId: "U2",
    toPinNumber: 1, // Left pin of chip2
    netName: "long_connection",
  }

  applyEditOperation(circuit, operation)

  // Should fall back to heuristic routing since distance > 10
  expect(`\n${circuit.toString()}\n`).toMatchInlineSnapshot(`
    "
               -5.0         0.0         5.0         10.0 
     0.6 U1                              U2
     0.4 ┌────┐                          ┌────┐
     0.2 ┤1  2├──────────────────────────┤1  2├
     0.0 └────┘                          └────┘
    "
  `)
})
