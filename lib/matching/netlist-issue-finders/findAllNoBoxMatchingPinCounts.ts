import type { NormalizedNetlist } from "lib/scoring/types"
import type { NoBoxMatchingPinCounts } from "../types"
import { getBoxShapeSignature } from "lib/adapt/getPinShapeSignature"

export function findAllNoBoxMatchingPinCounts(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
}): NoBoxMatchingPinCounts[] {
  const { candidateNetlist, targetNetlist } = params
  const issues: NoBoxMatchingPinCounts[] = []

  // Count each box's shape in the candidate netlist
  const candidateShapeCounts = new Map<string, number[]>()
  for (let i = 0; i < candidateNetlist.boxes.length; i++) {
    const box = candidateNetlist.boxes[i]
    const shape = getBoxShapeSignature({
      leftPinCount: box.leftPinCount,
      bottomPinCount: box.bottomPinCount,
      rightPinCount: box.rightPinCount,
      topPinCount: box.topPinCount,
    })
    if (!candidateShapeCounts.has(shape)) {
      candidateShapeCounts.set(shape, [])
    }
    candidateShapeCounts.get(shape)!.push(i)
  }

  // Check each box in the target netlist for a matching shape
  for (let targetBoxIndex = 0; targetBoxIndex < targetNetlist.boxes.length; targetBoxIndex++) {
    const targetBox = targetNetlist.boxes[targetBoxIndex]
    const targetShape = getBoxShapeSignature({
      leftPinCount: targetBox.leftPinCount,
      bottomPinCount: targetBox.bottomPinCount,
      rightPinCount: targetBox.rightPinCount,
      topPinCount: targetBox.topPinCount,
    })

    const candidateBoxesWithShape = candidateShapeCounts.get(targetShape) || []
    
    if (candidateBoxesWithShape.length === 0) {
      // No box in candidate netlist matches this target box's shape
      issues.push({
        type: "no_box_matching_pin_counts",
        candidateBoxIndex: -1, // No matching candidate box
        targetBoxIndex,
      })
    }
  }

  return issues
}
