import { test, expect } from "bun:test"
import { reorderChipPinsToCcw } from "lib/circuit-json/reorderChipPinsToCcw"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import pipeline06CircuitJson from "./assets/pipeline06.circuit.json"
import type { CircuitJson } from "circuit-json"

test("pipeline06-reorder-pins", () => {
  const originalCircuitJson = pipeline06CircuitJson as CircuitJson

  // Test the reorderChipPinsToCcw function
  const reorderedCircuitJson = reorderChipPinsToCcw(originalCircuitJson)

  // Verify that pin numbers have been reordered based on true_ccw_index
  const schematicPorts = reorderedCircuitJson.filter(
    (item: any) =>
      item.type === "schematic_port" &&
      item.schematic_component_id === "schematic_component_0" &&
      item.true_ccw_index !== undefined,
  )

  // Sort by true_ccw_index and check that pin numbers now match CCW order
  const sortedPorts = schematicPorts.sort(
    (a: any, b: any) => a.true_ccw_index - b.true_ccw_index,
  )
  expect(
    sortedPorts.map((port: any) => ({
      pin_number: port.pin_number,
      true_ccw_index: port.true_ccw_index,
    })),
  ).toEqual([
    { pin_number: 1, true_ccw_index: 0 },
    { pin_number: 2, true_ccw_index: 1 },
    { pin_number: 3, true_ccw_index: 2 },
    { pin_number: 4, true_ccw_index: 3 },
    { pin_number: 5, true_ccw_index: 4 },
    { pin_number: 6, true_ccw_index: 5 },
    { pin_number: 7, true_ccw_index: 6 },
    { pin_number: 8, true_ccw_index: 7 },
  ])

  // Generate SVG snapshot to visualize the reordered schematic
  expect(
    convertCircuitJsonToSchematicSvg(reorderedCircuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path, "pipeline06-reorder-pins")
})
