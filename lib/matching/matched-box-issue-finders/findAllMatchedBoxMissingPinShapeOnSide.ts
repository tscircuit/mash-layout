import type { NormalizedNetlist } from "lib/scoring/types"
import type { MatchedBoxMissingPinShapeOnSide } from "../types"
import { convertNormalizedNetlistToInputNetlist } from "lib/netlist/convertNormalizedNetlistToInputNetlist"
import { getPinShapeSignature } from "lib/adapt/getPinShapeSignature"
import { getPinSubsetNetlist } from "lib/adapt/getPinSubsetNetlist"
import { getPinSideIndex } from "lib/builder/getPinSideIndex"
import type { Side } from "lib/input-types"

export function findAllMatchedBoxMissingPinShape(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
  candidateBoxIndex: number
  targetBoxIndex: number
}): MatchedBoxMissingPinShapeOnSide[] {
  const candidateInputNetlist = convertNormalizedNetlistToInputNetlist(
    params.candidateNetlist,
  )
  const targetInputNetlist = convertNormalizedNetlistToInputNetlist(
    params.targetNetlist,
  )

  const candidatePinShapes: {
    signature: string
    side: Side
  }[] = []
  const targetPinShapes: {
    signature: string
    side: Side
  }[] = []

  const candidateBox = candidateInputNetlist.boxes[params.candidateBoxIndex]!
  const targetBox = targetInputNetlist.boxes[params.targetBoxIndex]!

  const candidatePinCount =
    candidateBox.leftPinCount +
    candidateBox.rightPinCount +
    candidateBox.topPinCount +
    candidateBox.bottomPinCount
  for (let i = 0; i < candidatePinCount; i++) {
    const pinNumber = i + 1
    const pinShapeNetlist = getPinSubsetNetlist({
      netlist: candidateInputNetlist,
      chipId: candidateBox.boxId,
      pinNumber,
    })
    candidatePinShapes.push({
      side: getPinSideIndex(pinNumber, candidateBox).side,
      signature: getPinShapeSignature({
        pinShapeNetlist,
      }),
    })
  }

  const unusedCandidatePinShapes = [...candidatePinShapes]

  const issues: MatchedBoxMissingPinShapeOnSide[] = []

  const targetPinCount =
    targetBox.leftPinCount +
    targetBox.rightPinCount +
    targetBox.topPinCount +
    targetBox.bottomPinCount
  for (let i = 0; i < targetPinCount; i++) {
    const targetPinNumber = i + 1
    const targetPinShapeNetlist = getPinSubsetNetlist({
      netlist: targetInputNetlist,
      chipId: targetBox.boxId,
      pinNumber: targetPinNumber,
    })

    // Skip pins that are simple not connected (it's not a major issue)
    if (targetPinShapeNetlist.connections.length === 0) {
      continue
    }

    const targetPin = {
      signature: getPinShapeSignature({
        pinShapeNetlist: targetPinShapeNetlist,
      }),
      side: getPinSideIndex(targetPinNumber, targetBox).side,
    }

    const matchingUnusedCandidatePinIndex = unusedCandidatePinShapes.findIndex(
      (candidatePin) =>
        candidatePin.signature === targetPin.signature &&
        candidatePin.side === targetPin.side,
    )

    if (matchingUnusedCandidatePinIndex !== -1) {
      unusedCandidatePinShapes.splice(matchingUnusedCandidatePinIndex, 1)
      continue
    }

    issues.push({
      type: "matched_box_missing_pin_shape_on_side",
      candidateBoxIndex: params.candidateBoxIndex,
      targetBoxIndex: params.targetBoxIndex,
      targetPinNumber,
      targetPinShapeSignature: targetPin.signature,
      candidateShapeSignatures: unusedCandidatePinShapes.map(
        (candidatePin) => candidatePin.signature,
      ),
      side: targetPin.side,
    })
  }

  return issues
}
