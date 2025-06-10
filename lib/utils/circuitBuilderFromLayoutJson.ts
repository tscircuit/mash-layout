import { CircuitBuilder, circuit, PinBuilder } from "../builder"
import type { PortReference, Side } from "../input-types"
import type { CircuitLayoutJson } from "../output-types"

export function circuitBuilderFromLayoutJson(
  layout: CircuitLayoutJson,
): CircuitBuilder {
  const C = circuit({ name: "corpus" })

  const chipMap: Record<string, ReturnType<CircuitBuilder["chip"]>> = {}
  for (const box of layout.boxes) {
    const totalPins =
      box.leftPinCount +
      box.rightPinCount +
      box.topPinCount +
      box.bottomPinCount
    const isPassive = totalPins === 2
    const chip = isPassive ? C.passive(box.boxId) : C.chip(box.boxId)
    chipMap[box.boxId] = chip
    // Pin creation order matters for CCW numbering: left, bottom, right, top
    if (box.leftPinCount) chip.leftpins(box.leftPinCount)
    if (box.bottomPinCount) chip.bottompins(box.bottomPinCount)
    if (box.rightPinCount) chip.rightpins(box.rightPinCount)
    if (box.topPinCount) chip.toppins(box.topPinCount)
    if (isPassive) {
      chip.at(box.centerX, box.centerY)
    } else {
      chip.at(
        box.centerX - chip.getWidth() / 2,
        box.centerY - chip.getHeight() / 2,
      )
    }
    for (const pin of box.pins) {
      const pb = chip.pin(pin.pinNumber)
      pb.x = pin.x
      pb.y = pin.y
    }
    chip.pinPositionsAreSet = true
  }

  const labelRefMap: Record<string, PortReference> = {}
  const netLabelIdToNetId: Record<string, string> = {}
  for (const nl of layout.netLabels) {
    netLabelIdToNetId[nl.netLabelId] = nl.netId
  }
  for (const path of layout.paths) {
    const fromRef: PortReference = path.from
    const toRef: PortReference = path.to

    if ("netLabelId" in fromRef) {
      fromRef.netId ??= netLabelIdToNetId[fromRef.netLabelId]!
    }
    if ("netLabelId" in toRef) {
      toRef.netId ??= netLabelIdToNetId[toRef.netLabelId]!
    }

    if ("netLabelId" in path.to) {
      labelRefMap[path.to.netLabelId] = fromRef
    }
    if ("netLabelId" in path.from) {
      labelRefMap[path.from.netLabelId] = toRef
    }
  }

  for (const nl of layout.netLabels) {
    C.addNetLabel({
      netId: nl.netId,
      x: nl.x,
      y: nl.y,
      anchorSide: nl.anchorPosition as Side,
      fromRef: labelRefMap[nl.netLabelId]!,
    })
  }

  for (const path of layout.paths) {
    const points = path.points
    if (points.length < 2) continue

    const fromRef: PortReference = path.from
    const toRef: PortReference = path.to

    if ("netLabelId" in fromRef) {
      fromRef.netId ??= netLabelIdToNetId[fromRef.netLabelId]!
    }
    if ("netLabelId" in toRef) {
      toRef.netId ??= netLabelIdToNetId[toRef.netLabelId]!
    }

    const fromIsPin = "boxId" in path.from && "pinNumber" in path.from
    const toIsPin = "boxId" in path.to && "pinNumber" in path.to

    let pb: any | null = null
    let segPoints = points
    let finalRef: PortReference | null = null

    if (fromIsPin) {
      const chip = chipMap[(path.from as any).boxId]!
      pb = new PinBuilder(chip, (path.from as any).pinNumber)
      pb.pathId = C.addPath().pathId
      finalRef = toRef
    } else if (toIsPin) {
      const chip = chipMap[(path.to as any).boxId]!
      pb = new PinBuilder(chip, (path.to as any).pinNumber)
      pb.pathId = C.addPath().pathId
      segPoints = [...points].reverse()
      finalRef = fromRef
    }

    if (pb) {
      pb.x = segPoints[0]!.x
      pb.y = segPoints[0]!.y

      for (let i = 1; i < segPoints.length; i++) {
        const p = segPoints[i]!
        pb.lineAt(p.x, p.y)
      }
      if (finalRef) {
        pb.lastCreatedLine!.end.ref = finalRef
      }
    } else {
      const pathId = C.addPath().pathId
      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i]!
        const end = points[i + 1]!
        C.lines.push({
          start: { x: start.x, y: start.y, ref: fromRef },
          end: { x: end.x, y: end.y, ref: toRef },
          pathId,
        })
      }
    }
  }

  return C
}
