import { test, expect } from "bun:test"
import { circuit } from "../../lib/builder"

test("getCircuitLayoutJson should handle circuit with only chips", () => {
  const C = circuit()
  C.chip("U1").leftpins(2).rightpins(2)
  C.chip("U2").toppins(1).bottompins(1)

  const layoutJson = C.getLayoutJson()

  expect(layoutJson.boxes).toHaveLength(2)
  expect(layoutJson.netLabels).toHaveLength(0)
  expect(layoutJson.paths).toHaveLength(0)
  expect(layoutJson.junctions).toHaveLength(0)

  // Verify chip properties are transferred correctly
  const u1 = layoutJson.boxes.find(box => box.boxId === "U1")
  const u2 = layoutJson.boxes.find(box => box.boxId === "U2")

  expect(u1).toBeDefined()
  if (u1) {
    expect(u1.leftPinCount).toBe(2)
    expect(u1.rightPinCount).toBe(2)
  }

  expect(u2).toBeDefined()
  if (u2) {
    expect(u2.topPinCount).toBe(1)
    expect(u2.bottomPinCount).toBe(1)
  }
})