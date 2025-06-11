import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"
import type { InputNetlist } from "lib/input-types"

test("drawMissingConnections skips drawing lines when passive pins are swapped", () => {
  const template = new CircuitBuilder()
  const U1 = template.chip().leftpins(1).rightpins(1)
  U1.pin(1).line(-2, 0).passive("R1").line(-1, 0).label("N1")

  const target: InputNetlist = {
    boxes: [
      {
        boxId: "U1",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
      {
        boxId: "R1",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [
      {
        connectedPorts: [
          { boxId: "U1", pinNumber: 1 },
          { boxId: "R1", pinNumber: 1 },
        ],
      },
      { connectedPorts: [{ boxId: "R1", pinNumber: 2 }, { netId: "N1" }] },
    ],
    nets: [{ netId: "N1" }],
  }

  const { appliedOperations } = adaptTemplateToTarget({ template, target })
  expect(appliedOperations).toEqual([])
})
