import { test, expect } from "bun:test"
import { circuit } from "../../lib/builder"

test("getCircuitLayoutJson should handle empty circuit", () => {
  const C = circuit()
  const layoutJson = C.getLayoutJson()

  expect(layoutJson.boxes).toHaveLength(0)
  expect(layoutJson.netLabels).toHaveLength(0)
  expect(layoutJson.paths).toHaveLength(0)
  expect(layoutJson.junctions).toHaveLength(0)
})
