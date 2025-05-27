import type { NormalizedNetlist, NormalizedNetlistBox } from "lib/scoring/types"
import type { MatchedBox } from "./getMatchedBoxes"

/**
 * Determines if a box is a passive component (has exactly 2 pins on opposite sides)
 */
export function isPassiveBox(box: NormalizedNetlistBox): boolean {
  const totalPins =
    box.leftPinCount + box.rightPinCount + box.topPinCount + box.bottomPinCount

  if (totalPins !== 2) return false

  // Check if pins are on opposite sides
  const hasHorizontalPins = box.leftPinCount > 0 && box.rightPinCount > 0
  const hasVerticalPins = box.topPinCount > 0 && box.bottomPinCount > 0

  return hasHorizontalPins || hasVerticalPins
}

/**
 * Creates a rotated variation of a passive box by swapping horizontal and vertical pin counts
 */
export function rotatePassiveBox(
  box: NormalizedNetlistBox,
): NormalizedNetlistBox {
  return {
    ...box,
    leftPinCount: box.topPinCount,
    rightPinCount: box.bottomPinCount,
    topPinCount: box.leftPinCount,
    bottomPinCount: box.rightPinCount,
  }
}

/**
 * Rotates a box by the specified degrees counter-clockwise
 */
export function rotateBoxByDegrees(
  box: NormalizedNetlistBox,
  degrees: 0 | 90 | 180 | 270,
): NormalizedNetlistBox {
  switch (degrees) {
    case 0:
      return box
    case 90:
      return {
        ...box,
        leftPinCount: box.bottomPinCount,
        rightPinCount: box.topPinCount,
        topPinCount: box.leftPinCount,
        bottomPinCount: box.rightPinCount,
      }
    case 180:
      return {
        ...box,
        leftPinCount: box.rightPinCount,
        rightPinCount: box.leftPinCount,
        topPinCount: box.bottomPinCount,
        bottomPinCount: box.topPinCount,
      }
    case 270:
      return {
        ...box,
        leftPinCount: box.topPinCount,
        rightPinCount: box.bottomPinCount,
        topPinCount: box.rightPinCount,
        bottomPinCount: box.leftPinCount,
      }
    default:
      return box
  }
}

/**
 * Creates a flipped variation of a passive box by swapping pins to opposite sides
 */
export function flipPassiveBox(
  box: NormalizedNetlistBox,
): NormalizedNetlistBox {
  return {
    ...box,
    leftPinCount: box.rightPinCount,
    rightPinCount: box.leftPinCount,
    topPinCount: box.bottomPinCount,
    bottomPinCount: box.topPinCount,
  }
}

/**
 * Generates netlist variations for passive rotation when both target and candidate boxes are passives.
 * Returns two variations of the target netlist:
 * 1. Rotated until pin counts match the candidate
 * 2. Rotated and then flipped (pins moved to opposite sides)
 */
export function getNetlistVariationWithPassiveRotation(params: {
  targetNetlist: NormalizedNetlist
  candidateNetlist: NormalizedNetlist
  targetBoxIndex: number
  candidateBoxIndex: number
}): Array<{ netlist: NormalizedNetlist; rotation: 0 | 90 | 180 | 270 }> {
  const { targetNetlist, candidateNetlist, targetBoxIndex, candidateBoxIndex } =
    params

  const targetBox = targetNetlist.boxes[targetBoxIndex]
  const candidateBox = candidateNetlist.boxes[candidateBoxIndex]

  // Check bounds and ensure boxes exist
  if (!targetBox || !candidateBox) {
    return [{ netlist: targetNetlist, rotation: 0 }]
  }

  // Only apply passive rotation if both boxes are passives
  if (!isPassiveBox(targetBox) || !isPassiveBox(candidateBox)) {
    return [{ netlist: targetNetlist, rotation: 0 }]
  }

  const variations: Array<{
    netlist: NormalizedNetlist
    rotation: 0 | 90 | 180 | 270
  }> = []

  // Variation 1: Rotate target box until pin counts match candidate
  let rotatedBox: NormalizedNetlistBox = { ...targetBox }
  let rotationDegrees: 0 | 90 | 180 | 270 = 0

  // Try up to 4 rotations to find matching orientation
  for (let i = 0; i < 4; i++) {
    if (
      rotatedBox.leftPinCount === candidateBox.leftPinCount &&
      rotatedBox.rightPinCount === candidateBox.rightPinCount &&
      rotatedBox.topPinCount === candidateBox.topPinCount &&
      rotatedBox.bottomPinCount === candidateBox.bottomPinCount
    ) {
      break
    }
    rotatedBox = rotatePassiveBox(rotatedBox)
    rotationDegrees = ((rotationDegrees + 90) % 360) as 0 | 90 | 180 | 270
  }

  // Create variation 1 with the rotated box
  const variation1: NormalizedNetlist = {
    ...targetNetlist,
    boxes: targetNetlist.boxes.map((box, index) =>
      index === targetBoxIndex ? rotatedBox : box,
    ),
  }
  variations.push({ netlist: variation1, rotation: rotationDegrees })

  // Variation 2: Flip the rotated box (move pins to opposite sides)
  const flippedBox = flipPassiveBox(rotatedBox)
  const variation2: NormalizedNetlist = {
    ...targetNetlist,
    boxes: targetNetlist.boxes.map((box, index) =>
      index === targetBoxIndex ? flippedBox : box,
    ),
  }
  const flippedRotation = ((rotationDegrees + 180) % 360) as 0 | 90 | 180 | 270
  variations.push({ netlist: variation2, rotation: flippedRotation })

  return variations
}
