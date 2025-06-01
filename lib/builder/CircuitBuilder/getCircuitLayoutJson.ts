import { CircuitLayoutJson } from "lib/output-types"
import { CircuitBuilder } from "./CircuitBuilder"
import { PortReference } from "lib/input-types"
import { ConnectivityMap } from "circuit-json-to-connectivity-map"
import { getRefKey, parseRefKey } from "../refkey"
import { Line } from "../circuit-types"

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
      const pinLocation = chip.getPinLocation(pin.pinNumber)
      pins.push({
        pinNumber: pin.pinNumber,
        x: pinLocation.x,
        y: pinLocation.y,
      })
    }

    const center = chip.getCenter()
    boxes.push({
      boxId: chip.chipId,
      leftPinCount: chip.leftPinCount,
      rightPinCount: chip.rightPinCount,
      topPinCount: chip.topPinCount,
      bottomPinCount: chip.bottomPinCount,
      centerX: center.x,
      centerY: center.y,
      pins,
    })
  }

  // Convert net labels
  console.log(circuitBuilder.netLabels)
  for (const label of circuitBuilder.netLabels) {
    netLabels.push({
      netLabelId: label.netLabelId,
      netId: label.netId,
      x: label.x,
      y: label.y,
      anchorPosition: label.anchorSide,
    })
  }

  for (const path of circuitBuilder.paths) {
    // Find the lines that are part of this path
    const lines = circuitBuilder.lines.filter((l) => l.pathId === path.pathId)

    // Find the two references within the lines
    const refs = new Set(
      lines.flatMap((l) => [
        getRefKey(
          l.start.fromJunctionId
            ? { junctionId: l.start.fromJunctionId }
            : l.start.ref,
        ),
        getRefKey(
          l.end.fromJunctionId
            ? { junctionId: l.end.fromJunctionId }
            : l.end.ref,
        ),
      ]),
    )

    if (refs.size > 2) {
      throw new Error(
        `Path composed of "${Array.from(refs).join(",")}" has more than 2 references (use a junction instead of connecting multiple points to the same pin)`,
      )
    }

    console.log(refs)

    if (refs.size === 1) continue

    let [fromStr, toStr] = Array.from(refs) as [string, string]

    if (getRefKey(lines[0]!.start.ref!) === toStr) {
      ;[fromStr, toStr] = [toStr, fromStr]
    }

    paths.push({
      points: lines.flatMap((l) => [
        {
          x: l.start.x,
          y: l.start.y,
        },
        {
          x: l.end.x,
          y: l.end.y,
        },
      ]),
      from: parseRefKey(fromStr!),
      to: parseRefKey(toStr!),
    })
  }

  // Create junctions from connection points that are marked as intersections
  for (const cp of circuitBuilder.connectionPoints) {
    junctions.push({
      junctionId: cp.junctionId,
      x: cp.x,
      y: cp.y,
    })
  }

  return {
    boxes,
    netLabels,
    paths,
    junctions,
  }
}
