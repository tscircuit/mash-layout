import type { InputNetlist } from "lib/input-types"
import type { NormalizationTransform } from "lib/scoring/normalizeNetlist"

/**
 * Generates ASCII art representation of a netlist box with pins
 */
export function getAsciiForNetlistBox(
  boxIndex: number,
  netlist: InputNetlist,
  transform: NormalizationTransform,
  maxWidth = 45,
): string[] {
  if (!transform) return [`Box ${boxIndex} (no transform)`]

  // Find the boxId that maps to this boxIndex
  const boxId = Object.keys(transform.boxIdToBoxIndex).find(
    (id) => transform.boxIdToBoxIndex[id] === boxIndex,
  )

  if (!boxId) return [`Box ${boxIndex} (not found)`]

  const box = netlist.boxes.find((b) => b.boxId === boxId)
  if (!box) return [`Box ${boxId} (not found)`]

  // Simplified ASCII box generation based on getReadableNetlist
  const output: string[] = []
  const { leftPinCount, rightPinCount, topPinCount, bottomPinCount } = box

  const BOX_INNER_WIDTH = Math.min(maxWidth - 4, 16) // Account for borders
  const SIDE_PADDING_WIDTH = 2 // Left and right pin padding
  const bodyHeight = Math.max(leftPinCount, rightPinCount, 1)

  let displayBoxId = boxId
  if (boxId.length > BOX_INNER_WIDTH - 2) {
    displayBoxId = `${boxId.substring(0, BOX_INNER_WIDTH - 3)}…`
  }

  // Top pins (properly aligned with box)
  if (topPinCount > 0) {
    let pinsRow = ""
    for (let i = 0; i < topPinCount; i++) {
      const pinNum = leftPinCount + bottomPinCount + rightPinCount + i + 1
      pinsRow += pinNum.toString().padStart(2)
    }
    // Align with the box borders including side padding
    output.push(
      `${" ".repeat(SIDE_PADDING_WIDTH + 1)}${pinsRow.substring(0, BOX_INNER_WIDTH)}`,
    )
  }

  // Box top border (aligned with side padding)
  output.push(
    `${" ".repeat(SIDE_PADDING_WIDTH)}┌${"─".repeat(BOX_INNER_WIDTH)}┐`,
  )

  // Box body with side pins
  for (let i = 0; i < bodyHeight; i++) {
    const leftPin = i < leftPinCount ? (i + 1).toString() : ""
    const rightPin =
      i < rightPinCount
        ? (
            leftPinCount +
            bottomPinCount +
            (rightPinCount - 1 - i) +
            1
          ).toString()
        : ""

    let lineContent = ""
    if (i === Math.floor((bodyHeight - 1) / 2)) {
      const paddingLeft = Math.floor(
        (BOX_INNER_WIDTH - displayBoxId.length) / 2,
      )
      const paddingRight = BOX_INNER_WIDTH - displayBoxId.length - paddingLeft
      lineContent =
        " ".repeat(paddingLeft) + displayBoxId + " ".repeat(paddingRight)
    } else {
      lineContent = " ".repeat(BOX_INNER_WIDTH)
    }

    output.push(
      `${leftPin.padStart(SIDE_PADDING_WIDTH)}│${lineContent}│${rightPin.padEnd(SIDE_PADDING_WIDTH)}`,
    )
  }

  // Box bottom border (aligned with side padding)
  output.push(
    `${" ".repeat(SIDE_PADDING_WIDTH)}└${"─".repeat(BOX_INNER_WIDTH)}┘`,
  )

  // Bottom pins (properly aligned with box)
  if (bottomPinCount > 0) {
    let pinsRow = ""
    for (let i = 0; i < bottomPinCount; i++) {
      const pinNum = leftPinCount + i + 1
      pinsRow += pinNum.toString().padStart(2)
    }
    // Align with the box borders including side padding
    output.push(
      `${" ".repeat(SIDE_PADDING_WIDTH + 1)}${pinsRow.substring(0, BOX_INNER_WIDTH)}`,
    )
  }

  return output
}
