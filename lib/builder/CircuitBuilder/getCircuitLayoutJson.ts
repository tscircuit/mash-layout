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
      // Use manually set pin positions if they exist, otherwise calculate
      const pinLocation =
        pin.x !== undefined && pin.y !== undefined
          ? { x: pin.x, y: pin.y }
          : chip.getPinLocation(pin.pinNumber)
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
  for (const label of circuitBuilder.netLabels) {
    // Determine orientation from the line segment that connects to this label
    let anchor = label.anchorSide
    const connectingLine = circuitBuilder.lines.find(
      (l) =>
        (l.end.ref as PortReference).netLabelId === label.netLabelId ||
        (l.start.ref as PortReference).netLabelId === label.netLabelId,
    )
    if (connectingLine) {
      let dx: number, dy: number
      if (
        (connectingLine.end.ref as PortReference).netLabelId ===
        label.netLabelId
      ) {
        dx = connectingLine.end.x - connectingLine.start.x
        dy = connectingLine.end.y - connectingLine.start.y
      } else {
        dx = connectingLine.start.x - connectingLine.end.x
        dy = connectingLine.start.y - connectingLine.end.y
      }
      anchor = dx > 0 ? "left" : dx < 0 ? "right" : dy > 0 ? "bottom" : "top"
    }
    netLabels.push({
      netLabelId: label.netLabelId,
      netId: label.netId,
      x: label.x,
      y: label.y,
      anchorPosition: anchor,
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

    let arRefs = Array.from(refs)

    if (arRefs.length === 3 && arRefs.some((r) => r.startsWith("junction["))) {
      arRefs = arRefs.filter((r) => !r.startsWith("junction["))
    }

    if (arRefs.length > 2) {
      throw new Error(
        `Path composed of "${Array.from(refs).join(",")}" has more than 2 references (use a junction instead of connecting multiple points to the same pin)`,
      )
    }

    if (arRefs.length === 1) continue

    let [fromStr, toStr] = arRefs as [string, string]

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
