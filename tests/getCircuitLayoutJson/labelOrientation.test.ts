import { test, expect } from "bun:test"
import { circuit } from "../../lib/builder"

// orientation should be computed from the final line to the label

// Build circuit with a label initially placed after a horizontal move
// Then mutate the line so the final segment to the label is vertical

test("label orientation follows final line direction", () => {
  const C = circuit({ name: "Test" })
  const U = C.chip("U1").leftpins(1)

  // Draw a horizontal line then add a label
  const pb = U.pin(1)
  pb.line(1, 0).label("NET")

  // Mutate the line so it ends vertically at the label
  const line = C.lines[0]!
  line.end.x = line.start.x
  line.end.y = line.start.y + 1

  // Update label position to match
  const label = C.netLabels[0]!
  label.x = line.end.x
  label.y = line.end.y

  const layout = C.getLayoutJson()
  expect(layout.netLabels[0]!.anchorPosition).toBe("bottom")
})
