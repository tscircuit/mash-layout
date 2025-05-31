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
  const { candidateNetlist, targetNetlist, candidateBoxIndex, targetBoxIndex } =
    params
  const issues: MatchedBoxMissingPinShapeBoxCountOnSide[] = []

  const candidateInputNetlist =
    convertNormalizedNetlistToInputNetlist(candidateNetlist)
  const targetInputNetlist =
    convertNormalizedNetlistToInputNetlist(targetNetlist)

  const candidateBox = candidateInputNetlist.boxes[candidateBoxIndex]
  const targetBox = targetInputNetlist.boxes[targetBoxIndex]

  if (!candidateBox || !targetBox) return issues

  // Collect box count signatures for candidate pins by side
  const candidateBoxCountShapes: { signature: string; side: Side }[] = []
  const candidatePinCount =
    candidateBox.leftPinCount +
    candidateBox.rightPinCount +
    candidateBox.topPinCount +
    candidateBox.bottomPinCount

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

  // Check if this is a symmetric component (2-pin passive)
  const totalTargetPinCount =
    targetBox.leftPinCount +
    targetBox.rightPinCount +
    targetBox.topPinCount +
    targetBox.bottomPinCount

  const isSymmetricComponent =
    candidatePinCount === 2 &&
    totalTargetPinCount === 2 &&
    Math.max(
      candidateBox.leftPinCount,
      candidateBox.rightPinCount,
      candidateBox.topPinCount,
      candidateBox.bottomPinCount,
    ) === 1 &&
    Math.max(
      targetBox.leftPinCount,
      targetBox.rightPinCount,
      targetBox.topPinCount,
      targetBox.bottomPinCount,
    ) === 1

  if (isSymmetricComponent) {
    // For symmetric components, check if the overall set of connectivity patterns match
    // regardless of pin assignments or sides
    const candidateSignatures = candidateBoxCountShapes
      .map((shape) => shape.signature)
      .filter((sig) => sig !== "box_count_0")
      .sort()

    const targetSignatures: string[] = []

    // Collect all target signatures
    for (let i = 0; i < totalTargetPinCount; i++) {
      const targetPinNumber = i + 1
      const targetBoxCountSignature = getBoxCountPinSignature({
        netlist: targetInputNetlist,
        chipId: targetBox.boxId,
        pinNumber: targetPinNumber,
      })

      if (targetBoxCountSignature !== "box_count_0") {
        targetSignatures.push(targetBoxCountSignature)
      }
    }

    targetSignatures.sort()

    // For symmetric components, just check if the sorted signature arrays match
    if (candidateSignatures.length > 0 && targetSignatures.length > 0) {
      if (candidateSignatures.join(",") !== targetSignatures.join(",")) {
        // Only report this as an issue if the sorted signatures don't match
        issues.push({
          type: "matched_box_missing_pin_shape_box_count_on_side",
          candidateBoxIndex,
          targetBoxIndex,
          side: "left", // Arbitrary side for symmetric components
          targetPinNumber: -1, // Not applicable for symmetric matching
          targetBoxCountSignature: targetSignatures.join(","),
          candidateBoxCountSignatures: candidateSignatures,
        })
      }
    }
  } else {
    // For non-symmetric components, use the original strict pin-by-pin matching
    for (let i = 0; i < totalTargetPinCount; i++) {
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

      const matchingUnusedCandidateIndex =
        unusedCandidateBoxCountShapes.findIndex(
          (candidatePin) =>
            candidatePin.signature === targetPin.signature &&
            candidatePin.side === targetPin.side,
        )

      if (matchingUnusedCandidateIndex === -1) {
        // No matching box count signature found on the same side
        const candidateBoxCountSignatures = candidateBoxCountShapes
          .filter((shape) => shape.side === targetPin.side)
          .map((shape) => shape.signature)

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
  }

  return issues
}
