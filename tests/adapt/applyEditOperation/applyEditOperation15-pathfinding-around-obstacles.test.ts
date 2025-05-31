import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { DrawLineBetweenPinsOp } from "lib/adapt/EditOperation"

test("applyEditOperation15 pathfinding routes around obstacles", () => {
  const circuit = new CircuitBuilder()

  // Create three chips in a line - the middle one will be an obstacle
  const chip1 = circuit.chip().leftpins(1).rightpins(1).at(-3, 0)
  const obstacle = circuit.chip().leftpins(1).rightpins(1).at(0, 0) // Middle chip as obstacle
  const chip3 = circuit.chip().leftpins(1).rightpins(1).at(3, 0)

  // Apply operation to draw line from chip1 to chip3 (should route around obstacle)
  const operation: DrawLineBetweenPinsOp = {
    type: "draw_line_between_pins",
    fromChipId: "U1",
    fromPinNumber: 2, // Right pin of chip1
    toChipId: "U3",
    toPinNumber: 1, // Left pin of chip3
    netName: "routed_connection",
  }

  applyEditOperation(circuit, operation)

  expect(`\n${circuit.toString()}\n`).toMatchInlineSnapshot(`
    "
               0.0         5.0 
     0.6 U1    U2    U3
     0.4 ┌────┐┌────┐┌────┐
     0.2 ┤1  2├┤1  2├┤1  2├
     0.0 └────┘└────┘└────┘
    -0.2       │     │
    -0.4       │     │
    -0.6       │     │
    -0.8       └─────┘
    "
  `)
})
