import type { InputNetlist } from "lib/input-types"
import type { NormalizationTransform } from "lib/scoring/normalizeNetlist"
import type { MatchedBox } from "lib/matching/types"
import { getAllPinShapeSignatures } from "./getAllPinShapeSignatures"

export const getPairwisePinShapeSignatures = ({
  targetNetlist,
  candidateNetlist,
  matchedBoxes,
  targetTransform,
  candidateTransform,
}: {
  targetNetlist: InputNetlist
  candidateNetlist: InputNetlist
  matchedBoxes: MatchedBox[]
  targetTransform: NormalizationTransform
  candidateTransform: NormalizationTransform
}): Array<{
  targetBoxIdPinNumber: string
  candidateBoxIdPinNumber: string
  targetPinShapeSignature: string
  candidatePinShapeSignature: string
}> => {
  const targetSignatures = getAllPinShapeSignatures(targetNetlist)
  const candidateSignatures = getAllPinShapeSignatures(candidateNetlist)

  const pairwiseSignatures: Array<{
    targetBoxIdPinNumber: string
    candidateBoxIdPinNumber: string
    targetPinShapeSignature: string
    candidatePinShapeSignature: string
  }> = []

  for (const match of matchedBoxes) {
    // Get the original box IDs from the transforms
    const targetBoxId = Object.keys(targetTransform.boxIdToBoxIndex).find(
      (id) => targetTransform.boxIdToBoxIndex[id] === match.targetBoxIndex,
    )
    const candidateBoxId = Object.keys(candidateTransform.boxIdToBoxIndex).find(
      (id) =>
        candidateTransform.boxIdToBoxIndex[id] === match.candidateBoxIndex,
    )

    if (!targetBoxId || !candidateBoxId) continue

    // Get pin signatures for these boxes
    const targetBoxSignatures = targetSignatures.filter(
      (sig) => sig.boxId === targetBoxId,
    )
    const candidateBoxSignatures = candidateSignatures.filter(
      (sig) => sig.boxId === candidateBoxId,
    )

    // Create a set of all pin numbers from both boxes
    const allPinNumbers = new Set([
      ...targetBoxSignatures.map((sig) => sig.pinNumber),
      ...candidateBoxSignatures.map((sig) => sig.pinNumber),
    ])

    for (const pinNumber of allPinNumbers) {
      const targetSig = targetBoxSignatures.find(
        (sig) => sig.pinNumber === pinNumber,
      )
      const candidateSig = candidateBoxSignatures.find(
        (sig) => sig.pinNumber === pinNumber,
      )

      pairwiseSignatures.push({
        targetBoxIdPinNumber: targetSig ? `${targetBoxId}.${pinNumber}` : "",
        candidateBoxIdPinNumber: candidateSig
          ? `${candidateBoxId}.${pinNumber}`
          : "",
        targetPinShapeSignature: targetSig?.pinShapeSignature || "",
        candidatePinShapeSignature: candidateSig?.pinShapeSignature || "",
      })
    }
  }

  return pairwiseSignatures
}
