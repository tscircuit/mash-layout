import type { CircuitBuilder } from "lib/builder"
import type { DrawLineBetweenPinsOp } from "../EditOperation"

export function applyDrawLineBetweenPins(
  circuitBuilder: CircuitBuilder,
  operation: DrawLineBetweenPinsOp,
): void {
  const { fromChipId, fromPinNumber, toChipId, toPinNumber, netName } =
    operation

  // Find the chips
  const fromChip = circuitBuilder.chips.find(
    (chip) => chip.chipId === fromChipId,
  )
  const toChip = circuitBuilder.chips.find((chip) => chip.chipId === toChipId)

  if (!fromChip) {
    throw new Error(`Could not find from chip with id: ${fromChipId}`)
  }

  if (!toChip) {
    throw new Error(`Could not find to chip with id: ${toChipId}`)
  }

  // Find the pins
  const fromPin = fromChip.pin(fromPinNumber)
  const toPin = toChip.pin(toPinNumber)

  if (!fromPin) {
    throw new Error(`Could not find pin ${fromPinNumber} on chip ${fromChipId}`)
  }

  if (!toPin) {
    throw new Error(`Could not find pin ${toPinNumber} on chip ${toChipId}`)
  }

  // Get target pin position in world coordinates
  const toPinPos = toChip.getPinLocation(toPinNumber)

  // Create a unique mark name for this connection
  const markName =
    netName ||
    `connection_${fromChipId}_${fromPinNumber}_to_${toChipId}_${toPinNumber}`

  // Use pathfinding to draw lines that avoid obstacles
  fromPin.pathTo(toPinPos.x, toPinPos.y).mark(markName)

  // Connect the toPin to the marked point
  toPin.connectToMark(markName)
}
