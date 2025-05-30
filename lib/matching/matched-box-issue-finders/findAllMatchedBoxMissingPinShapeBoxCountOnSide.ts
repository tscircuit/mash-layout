import type { NormalizedNetlist } from "lib/scoring/types"
import type { MatchedBoxMissingPinShapeBoxCountOnSide } from "../types"
import { convertNormalizedNetlistToInputNetlist } from "lib/netlist/convertNormalizedNetlistToInputNetlist"
import { getBoxCountPinSignature } from "lib/adapt/getPinShapeSignature"
import { getPinSideIndex } from "lib/builder/getPinSideIndex"
import type { Side } from "lib/input-types"

export function findAllMatchedBoxMissingPinShapeBoxCountOnSide(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
  candidateBoxIndex: number
  targetBoxIndex: number
}): MatchedBoxMissingPinShapeBoxCountOnSide[] {
  const { candidateNetlist, targetNetlist, candidateBoxIndex, targetBoxIndex } = params
  const issues: MatchedBoxMissingPinShapeBoxCountOnSide[] = []

  const candidateInputNetlist = convertNormalizedNetlistToInputNetlist(candidateNetlist)
  const targetInputNetlist = convertNormalizedNetlistToInputNetlist(targetNetlist)

  const candidateBox = candidateInputNetlist.boxes[candidateBoxIndex]
  const targetBox = targetInputNetlist.boxes[targetBoxIndex]

  if (!candidateBox || !targetBox) return issues

  // Collect box count signatures for candidate pins by side
  const candidateBoxCountShapes: { signature: string; side: Side }[] = []
  const candidatePinCount = 
    candidateBox.leftPinCount + candidateBox.rightPinCount + 
    candidateBox.topPinCount + candidateBox.bottomPinCount

  for (let i = 0; i < candidatePinCount; i++) {
    const pinNumber = i + 1
    const boxCountSignature = getBoxCountPinSignature({
      netlist: candidateInputNetlist,
      chipId: candidateBox.boxId,
      pinNumber,
    })
    candidateBoxCountShapes.push({
      side: getPinSideIndex(pinNumber, candidateBox).side,
      signature: boxCountSignature,
    })
  }

  const unusedCandidateBoxCountShapes = [...candidateBoxCountShapes]

  // Check target pins
  const targetPinCount = 
    targetBox.leftPinCount + targetBox.rightPinCount + 
    targetBox.topPinCount + targetBox.bottomPinCount

  for (let i = 0; i < targetPinCount; i++) {
    const targetPinNumber = i + 1
    const targetBoxCountSignature = getBoxCountPinSignature({
      netlist: targetInputNetlist,
      chipId: targetBox.boxId,
      pinNumber: targetPinNumber,
    })

    // Skip pins that are not connected
    if (targetBoxCountSignature === "box_count_0") {
      continue
    }

    const targetPin = {
      signature: targetBoxCountSignature,
      side: getPinSideIndex(targetPinNumber, targetBox).side,
    }

    const matchingUnusedCandidateIndex = unusedCandidateBoxCountShapes.findIndex(
      (candidatePin) =>
        candidatePin.signature === targetPin.signature &&
        candidatePin.side === targetPin.side
    )

    if (matchingUnusedCandidateIndex === -1) {
      // No matching box count signature found on the same side
      const candidateBoxCountSignatures = candidateBoxCountShapes
        .filter(shape => shape.side === targetPin.side)
        .map(shape => shape.signature)

      issues.push({
        type: "matched_box_missing_pin_shape_box_count_on_side",
        candidateBoxIndex,
        targetBoxIndex,
        side: targetPin.side,
        targetPinNumber,
        targetBoxCountSignature,
        candidateBoxCountSignatures,
      })
    } else {
      // Remove the used candidate signature
      unusedCandidateBoxCountShapes.splice(matchingUnusedCandidateIndex, 1)
    }
  }

  return issues
}