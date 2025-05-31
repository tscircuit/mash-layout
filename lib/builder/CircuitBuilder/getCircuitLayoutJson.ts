import { CircuitLayoutJson } from "lib/output-types"
import { CircuitBuilder } from "./CircuitBuilder"

export const getCircuitLayoutJson = (
  circuitBuilder: CircuitBuilder,
): CircuitLayoutJson => {
  const boxes: CircuitLayoutJson["boxes"] = []
  const netLabels: CircuitLayoutJson["netLabels"] = []
  const paths: CircuitLayoutJson["paths"] = []
  const junctions: CircuitLayoutJson["junctions"] = []

  // Convert chips to laid out boxes
  for (const chip of circuitBuilder.chips) {
    // Set pin positions if not already set
    if (!chip.pinPositionsAreSet) {
      chip.setPinPositions()
    }

    // Get all pins for this chip
    const pins: Array<{ pinNumber: number; x: number; y: number }> = []

    const allPins = [
      ...chip.leftPins,
      ...chip.bottomPins,
      ...chip.rightPins,
      ...chip.topPins,
    ]

    for (const pin of allPins) {
      pins.push({
        pinNumber: pin.pinNumber,
        x: pin.x,
        y: pin.y,
      })
    }

    boxes.push({
      boxId: chip.chipId,
      leftPinCount: chip.leftPinCount,
      rightPinCount: chip.rightPinCount,
      topPinCount: chip.topPinCount,
      bottomPinCount: chip.bottomPinCount,
      centerX: chip.x,
      centerY: chip.y,
      pins,
    })
  }

  // Convert net labels
  for (const label of circuitBuilder.netLabels) {
    netLabels.push({
      netId: label.labelId,
      x: label.x,
      y: label.y,
    })
  }

  // Convert lines to paths
  for (const line of circuitBuilder.lines) {
    paths.push({
      points: [
        { x: line.start.x, y: line.start.y },
        { x: line.end.x, y: line.end.y },
      ],
      from: line.start.ref,
      to: line.end.ref,
    })
  }

  // Create junctions from connection points that are marked as intersections
  let junctionCounter = 1
  for (const cp of circuitBuilder.connectionPoints) {
    if (cp.showAsIntersection) {
      junctions.push({
        junctionId: `J${junctionCounter++}`,
        x: cp.x,
        y: cp.y,
      })
    }
  }

  return {
    boxes,
    netLabels,
    paths,
    junctions,
  }
}
