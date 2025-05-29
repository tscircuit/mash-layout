import type { CircuitJson } from "circuit-json"

/**
 * Reorders schematic ports to be in counter-clockwise order.
 *
 * Often, a user will specify an alternative order for ports in their tscircuit code,
 * we reorder them here so that matching logic doesn't need to worry about the placement
 * of pins.
 *
 * This requires the following steps:
 * 1. Get all the pins for each source component
 * 2. Identify if they're out of order considering SIDES_CCW and the pin_number of each schematic_port
 * 3. Sort the pins by their true_ccw_index
 * 4. Swap the pin positions to match the true_ccw_index+1
 * 5. Rewrite the pin numbers such that they match true_ccw_index+1
 */
export const reorderChipPinsToCcw = (circuitJson: CircuitJson): CircuitJson => {
  return circuitJson
}
