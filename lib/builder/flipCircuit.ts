import type { CircuitBuilder } from "./CircuitBuilder/CircuitBuilder"

export const flipXCircuit = (circuit: CircuitBuilder): CircuitBuilder => {
  // Find minX and maxX of all occupied cells (chips, lines, netLabels, connectionPoints)
  const xs: number[] = []
  for (const chip of circuit.chips) {
    xs.push(chip.x)
    xs.push(chip.x + 4)
  }
  for (const line of circuit.lines) {
    xs.push(line.start.x, line.end.x)
  }
  for (const label of circuit.netLabels) {
    xs.push(label.x)
  }
  for (const cp of circuit.connectionPoints) {
    xs.push(cp.x)
  }
  if (xs.length === 0) return circuit
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const mid = minX + maxX

  // Flip chips
  for (const chip of circuit.chips) {
    chip.x = mid - (chip.x + 4)
    // Swap left/right pins while preserving correct CCW numbering
    // – right-side pins (stored bottom→top) move to the left **unchanged**
    // – left-side pins (stored top→bottom) move to the right **reversed**
    const oldLeftPins = chip.leftPins
    const oldRightPins = chip.rightPins

    chip.leftPins = oldRightPins.slice() // keep order bottom→top
    chip.rightPins = oldLeftPins.slice().reverse() // convert to bottom→top
    // Swap counts
    const tmpCount = chip.leftPinCount
    chip.leftPinCount = chip.rightPinCount
    chip.rightPinCount = tmpCount
    // Pin map needs to be rebuilt if used
  }
  // Flip lines
  for (const line of circuit.lines) {
    line.start.x = mid - line.start.x
    line.end.x = mid - line.end.x
  }
  // Flip netLabels
  for (const label of circuit.netLabels) {
    label.x = mid - label.x
  }
  // Flip connectionPoints
  for (const cp of circuit.connectionPoints) {
    cp.x = mid - cp.x
  }
  return circuit
}
