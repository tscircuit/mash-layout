import { isSamePortRef } from "lib/builder/isSamePortRef"
import type { RemoveChipOp } from "lib/adapt/EditOperation"
import type { CircuitBuilder } from "lib/builder"
import type { Line, PortReference } from "lib/builder/circuit-types"

export function applyRemoveChip(C: CircuitBuilder, op: RemoveChipOp) {
  const { chipId } = op
  /* 1. drop chip ---------------------------------------------------- */
  C.chips = C.chips.filter((c) => c.chipId !== chipId)

  /* 2. remove any artefact that references the chip ---------------- */
  const refBelongs = (ref: any) => "boxId" in ref && ref.boxId === chipId

  // Find lines that are directly connected to the removed chip
  const linesToChip = C.lines.filter(
    (l) => refBelongs(l.start.ref) || refBelongs(l.end.ref),
  )

  // Remove lines that have both ends connected to the chip
  C.lines = C.lines.filter(
    (l) => !(refBelongs(l.start.ref) && refBelongs(l.end.ref)),
  )

  // For lines with one end connected to the chip, we need to intelligently remove segments
  for (const line of linesToChip) {
    if (refBelongs(line.start.ref) && refBelongs(line.end.ref)) {
      // Both ends connect to the chip - already removed above
      continue
    }

    // Determine which end connects to the chip and which connects to something else
    const chipEnd = refBelongs(line.start.ref) ? line.start : line.end
    const otherEnd = refBelongs(line.start.ref) ? line.end : line.start

    // Check if the other end is at an intersection or connection point
    const isAtIntersection = isCoordinateAtIntersection(
      C,
      otherEnd.x,
      otherEnd.y,
      line,
    )

    if (isAtIntersection) {
      // There's an intersection - don't remove this line segment as it might connect other components
      // Instead, keep the line but remove it from our lines list since it's already been handled
      C.lines = C.lines.filter((l) => l !== line)
    } else {
      // No intersection - safe to remove this line segment
      C.lines = C.lines.filter((l) => l !== line)

      // Continue removing connected line segments until we hit an intersection
      removeLineSegmentsUntilIntersection(
        C,
        otherEnd.x,
        otherEnd.y,
        otherEnd.ref,
        chipEnd.ref,
      )
    }
  }

  C.connectionPoints = C.connectionPoints.filter((cp) => !refBelongs(cp.ref))
  C.netLabels = C.netLabels.filter((nl) => !refBelongs(nl.fromRef))
}

function isCoordinateAtIntersection(
  C: CircuitBuilder,
  x: number,
  y: number,
  excludeLine: Line,
): boolean {
  // Count how many lines/connection points are at this coordinate
  let connectionCount = 0

  // Count lines that end at this coordinate (excluding the line we're checking)
  for (const line of C.lines) {
    if (line === excludeLine) continue

    if (
      (line.start.x === x && line.start.y === y) ||
      (line.end.x === x && line.end.y === y)
    ) {
      connectionCount++
    }
  }

  // Count connection points at this coordinate
  for (const cp of C.connectionPoints) {
    if (cp.x === x && cp.y === y) {
      connectionCount++
      break // Only count connection points once per coordinate
    }
  }

  // If there are 2 or more connections (besides the line we're removing), it's an intersection
  return connectionCount >= 2
}

function removeLineSegmentsUntilIntersection(
  C: CircuitBuilder,
  x: number,
  y: number,
  currentRef: PortReference,
  removedChipRef: PortReference,
) {
  // Find any line that starts or ends at this coordinate and continues further
  const continuingLines = C.lines.filter((line) => {
    const startsHere =
      line.start.x === x &&
      line.start.y === y &&
      !isSamePortRef(line.start.ref, removedChipRef)
    const endsHere =
      line.end.x === x &&
      line.end.y === y &&
      !isSamePortRef(line.end.ref, removedChipRef)
    return startsHere || endsHere
  })

  for (const line of continuingLines) {
    // Determine the next coordinate to check
    const nextPoint =
      line.start.x === x && line.start.y === y ? line.end : line.start

    // Check if the next coordinate is an intersection
    const isNextIntersection = isCoordinateAtIntersection(
      C,
      nextPoint.x,
      nextPoint.y,
      line,
    )

    if (isNextIntersection) {
      // Stop here - don't remove this line as it connects to other components
      return
    } else {
      // Remove this line and continue checking from the next point
      C.lines = C.lines.filter((l) => l !== line)
      removeLineSegmentsUntilIntersection(
        C,
        nextPoint.x,
        nextPoint.y,
        nextPoint.ref,
        removedChipRef,
      )
    }
  }
}
