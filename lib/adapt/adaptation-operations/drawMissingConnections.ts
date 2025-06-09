import type { InputNetlist } from "lib/input-types"
import type { CircuitBuilder } from "lib/builder"
import type { ChipBuilder } from "lib/builder"
import type { EditOperation } from "lib/adapt/EditOperation"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"

function getPossiblePinNumbers(
  chip: ChipBuilder | undefined,
  pin: number,
): number[] {
  if (!chip?.isPassive) return [pin]
  if (chip.totalPinCount === 2) {
    return pin === 1 ? [1, 2] : pin === 2 ? [2, 1] : [pin]
  }
  return [pin]
}

export function drawMissingConnections(params: {
  template: CircuitBuilder
  target: InputNetlist
  matchedBoxes: MatchedBoxWithChipIds[]
}): {
  appliedOperations: EditOperation[]
} {
  const appliedOperations: EditOperation[] = []
  const { template, target, matchedBoxes } = params

  // Get target connections that should exist
  const targetConnections = target.connections || []

  // For each target connection, check if it involves two boxes
  for (const targetConnection of targetConnections) {
    // Extract box-to-box connections from connectedPorts
    const boxPorts = targetConnection.connectedPorts.filter(
      (port) => "boxId" in port,
    ) as Array<{ boxId: string; pinNumber: number }>

    // Only process connections between exactly 2 boxes
    if (boxPorts.length !== 2) {
      continue
    }

    const [fromPort, toPort] = boxPorts

    if (!fromPort || !toPort) {
      continue // Skip if ports are not properly defined
    }

    // Find which template chips these target boxes map to
    const fromBoxMatch = matchedBoxes.find(
      (match) => target.boxes?.[match.targetBoxIndex]?.boxId === fromPort.boxId,
    )
    const toBoxMatch = matchedBoxes.find(
      (match) => target.boxes?.[match.targetBoxIndex]?.boxId === toPort.boxId,
    )

    if (!fromBoxMatch?.candidateChipId || !toBoxMatch?.candidateChipId) {
      continue // Skip if we can't map both boxes
    }

    const templateFromChipId = fromBoxMatch.candidateChipId
    const templateToChipId = toBoxMatch.candidateChipId

    // Check if this connection already exists in the template
    const templateNetlist = template.getNetlist()
    const templateConnections = templateNetlist.connections || []

    const fromChip = template.chips.find(
      (c) => c.chipId === templateFromChipId,
    )
    const toChip = template.chips.find((c) => c.chipId === templateToChipId)

    const possibleFromPins = getPossiblePinNumbers(fromChip, fromPort.pinNumber)
    const possibleToPins = getPossiblePinNumbers(toChip, toPort.pinNumber)

    const connectionExists = templateConnections.some((templateConnection) => {
      const templateBoxPorts = templateConnection.connectedPorts.filter(
        (port) => "boxId" in port,
      ) as Array<{ boxId: string; pinNumber: number }>

      for (const pf of possibleFromPins) {
        for (const pt of possibleToPins) {
          const hasFromChipPin = templateBoxPorts.some(
            (port) => port.boxId === templateFromChipId && port.pinNumber === pf,
          )
          const hasToChipPin = templateBoxPorts.some(
            (port) => port.boxId === templateToChipId && port.pinNumber === pt,
          )

          if (hasFromChipPin && hasToChipPin) {
            return true
          }
        }
      }

      return false
    })

    if (!connectionExists) {
      // Create operation to draw the missing connection
      const op: EditOperation = {
        type: "draw_line_between_pins",
        fromChipId: templateFromChipId,
        fromPinNumber: fromPort.pinNumber,
        toChipId: templateToChipId,
        toPinNumber: toPort.pinNumber,
      }

      try {
        applyEditOperation(template, op)
        appliedOperations.push(op)
        // Only apply one operation at a time to avoid conflicts
        break
      } catch (error) {
        console.warn(`Failed to apply draw line operation:`, error)
      }
    }
  }

  return { appliedOperations }
}
