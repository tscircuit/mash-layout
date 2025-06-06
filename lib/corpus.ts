import corpus from "./corpus-vfs"
import type { CircuitLayoutJson } from "./output-types"
import { circuit, CircuitBuilder } from "./builder"
import type { CircuitTemplateFn } from "templates"
import type { Side, PortReference } from "./input-types"

const layouts: Record<string, CircuitLayoutJson> = corpus as any

export function circuitBuilderFromLayoutJson(
  layout: CircuitLayoutJson,
): CircuitBuilder {
  const C = circuit({ name: "corpus" })

  for (const box of layout.boxes) {
    const totalPins =
      box.leftPinCount +
      box.rightPinCount +
      box.topPinCount +
      box.bottomPinCount
    const isPassive = totalPins === 2
    const chip = isPassive ? C.passive(box.boxId) : C.chip(box.boxId)
    if (box.leftPinCount) chip.leftpins(box.leftPinCount)
    if (box.rightPinCount) chip.rightpins(box.rightPinCount)
    if (box.topPinCount) chip.toppins(box.topPinCount)
    if (box.bottomPinCount) chip.bottompins(box.bottomPinCount)
    chip.at(
      box.centerX - chip.getWidth() / 2,
      box.centerY - chip.getHeight() / 2,
    )
    chip.pinPositionsAreSet = true
    for (const pin of box.pins) {
      const pb = chip.pin(pin.pinNumber)
      pb.x = pin.x
      pb.y = pin.y
    }
  }

  const labelRefMap: Record<string, PortReference> = {}
  for (const path of layout.paths) {
    const fromRef = path.from as PortReference
    const toRef = path.to as PortReference
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
      netLabelId: nl.netLabelId,
      x: nl.x,
      y: nl.y,
      anchorSide: nl.anchorPosition as Side,
      fromRef: labelRefMap[nl.netLabelId] ?? { netId: nl.netId },
    })
  }

  let pathCounter = 1
  for (const path of layout.paths) {
    const start = path.points[0]!
    const end = path.points[path.points.length - 1]!
    C.lines.push({
      start: { x: start.x, y: start.y, ref: path.from as PortReference },
      end: { x: end.x, y: end.y, ref: path.to as PortReference },
      pathId: `PATH${pathCounter++}`,
    })
  }

  return C
}

export const CORPUS_TEMPLATE_FNS: CircuitTemplateFn[] = Object.values(
  layouts,
).map((layout) => () => circuitBuilderFromLayoutJson(layout))
