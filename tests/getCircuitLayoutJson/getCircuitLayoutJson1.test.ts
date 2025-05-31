import { test, expect } from "bun:test"
import { circuit } from "../../lib/builder"
import type { CircuitLayoutJson } from "../../lib/output-types"

test("getCircuitLayoutJson should convert CircuitBuilder to layout format", () => {
  const C = circuit({ name: "TestCircuit" })

  // Create a chip with pins on multiple sides using conventional pattern
  const U1 = C.chip("U1").leftpins(2).rightpins(2).toppins(1).bottompins(1)

  // Add connections with passives and labels using conventional patterns
  U1.pin(1).line(2, 0).line(0, 1).passive("R1").line(0, 1).label("VCC")
  U1.pin(2).line(-2, 0).label("GND") 
  U1.pin(3).line(3, 0).intersect().line(1, 0).label("OUT")
  U1.pin(4).line(2, 0).mark("junction")

  // Connect to junction from another pin
  U1.fromMark("junction").line(0, -1).passive("R2").line(0, -1).label("NET")

  // Generate the layout JSON
  const layoutJson: CircuitLayoutJson = C.getLayoutJson()

  // Verify basic structure
  expect(layoutJson.boxes.length).toBeGreaterThan(0) // Should have at least U1
  expect(layoutJson.netLabels.length).toBeGreaterThan(0) // Should have labels
  expect(layoutJson.paths.length).toBeGreaterThan(0) // Should have paths from connections

  // Verify chip U1 details
  const u1Box = layoutJson.boxes.find((box) => box.boxId === "U1")
  expect(u1Box).toBeDefined()
  if (u1Box) {
    expect(u1Box.leftPinCount).toBe(2)
    expect(u1Box.rightPinCount).toBe(2)
    expect(u1Box.topPinCount).toBe(1)
    expect(u1Box.bottomPinCount).toBe(1)
    expect(u1Box.pins.length).toBeGreaterThan(0) // Should have pins
  }

  // Verify passive components were created
  const passiveBoxes = layoutJson.boxes.filter((box) => box.boxId.startsWith("R"))
  expect(passiveBoxes.length).toBeGreaterThan(0) // Should have at least R1

  // Verify pin coordinates are set and have proper structure
  for (const box of layoutJson.boxes) {
    for (const pin of box.pins) {
      expect(typeof pin.x).toBe("number")
      expect(typeof pin.y).toBe("number")
      expect(pin.pinNumber).toBeGreaterThan(0)
    }
  }

  // Verify net labels exist and have expected properties
  const netLabels = layoutJson.netLabels
  expect(netLabels.length).toBeGreaterThan(0)
  for (const label of netLabels) {
    expect(typeof label.netId).toBe("string")
    expect(typeof label.x).toBe("number")
    expect(typeof label.y).toBe("number")
  }

  // Verify paths have correct structure
  for (const path of layoutJson.paths) {
    expect(path.points).toHaveLength(2) // All paths should be simple lines
    expect(path.from).toBeDefined()
    expect(path.to).toBeDefined()
    expect(typeof path.points[0]!.x).toBe("number")
    expect(typeof path.points[0]!.y).toBe("number")
    expect(typeof path.points[1]!.x).toBe("number")
    expect(typeof path.points[1]!.y).toBe("number")
  }

  // Test the overall structure matches expected CircuitLayoutJson interface
  expect(layoutJson).toHaveProperty("boxes")
  expect(layoutJson).toHaveProperty("netLabels")
  expect(layoutJson).toHaveProperty("paths")
  expect(layoutJson).toHaveProperty("junctions")

  // Verify that all boxes have the required properties
  for (const box of layoutJson.boxes) {
    expect(box).toHaveProperty("boxId")
    expect(box).toHaveProperty("centerX")
    expect(box).toHaveProperty("centerY")
    expect(box).toHaveProperty("leftPinCount")
    expect(box).toHaveProperty("rightPinCount")
    expect(box).toHaveProperty("topPinCount")
    expect(box).toHaveProperty("bottomPinCount")
    expect(box).toHaveProperty("pins")
    expect(Array.isArray(box.pins)).toBe(true)
  }

  // Verify that all paths have the required structure
  for (const path of layoutJson.paths) {
    expect(path).toHaveProperty("points")
    expect(path).toHaveProperty("from")
    expect(path).toHaveProperty("to")
    expect(Array.isArray(path.points)).toBe(true)
  }
})