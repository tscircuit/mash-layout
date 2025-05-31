import type { CircuitBuilder } from "../builder/CircuitBuilder"

export interface Point {
  x: number
  y: number
}

export function isPathClear(
  from: Point,
  to: Point,
  circuit: CircuitBuilder,
  excludeChipId: string,
): boolean {
  // Simple obstacle check - sample a few points along the direct path
  const steps = 10
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const checkX = from.x + (to.x - from.x) * t
    const checkY = from.y + (to.y - from.y) * t

    if (isPointInObstacle(checkX, checkY, circuit, excludeChipId)) {
      return false
    }
  }
  return true
}

export function isPointInObstacle(
  x: number,
  y: number,
  circuit: CircuitBuilder,
  excludeChipId: string,
): boolean {
  for (const chip of circuit.chips) {
    if (chip.chipId === excludeChipId) {
      continue // Don't treat the specified chip as an obstacle
    }

    const width = chip.getWidth()
    const height = chip.getHeight()
    const margin = 0.1 // Small margin around chips

    if (
      x >= chip.x - width / 2 - margin &&
      x <= chip.x + width / 2 + margin &&
      y >= chip.y - height / 2 - margin &&
      y <= chip.y + height / 2 + margin
    ) {
      return true
    }
  }
  return false
}

export function findClearWaypoint(
  fromX: number,
  fromY: number,
  targetX: number,
  targetY: number,
  circuit: CircuitBuilder,
  excludeChipId: string,
): Point {
  const deltaX = targetX - fromX
  const deltaY = targetY - fromY

  // Try horizontal-first routing
  const midPoint1 = { x: targetX, y: fromY }
  if (!isPointInObstacle(midPoint1.x, midPoint1.y, circuit, excludeChipId)) {
    return midPoint1
  }

  // Try vertical-first routing
  const midPoint2 = { x: fromX, y: targetY }
  if (!isPointInObstacle(midPoint2.x, midPoint2.y, circuit, excludeChipId)) {
    return midPoint2
  }

  // Find a clear waypoint by moving away from obstacles
  let margin = 1.0
  let waypointX = fromX + (deltaX > 0 ? margin : -margin)
  let waypointY = fromY + (deltaY > 0 ? margin : -margin)

  // Adjust waypoint if it's still in an obstacle
  while (
    isPointInObstacle(waypointX, waypointY, circuit, excludeChipId) &&
    margin < 3.0
  ) {
    margin += 0.5
    waypointX = fromX + (deltaX > 0 ? margin : -margin)
    waypointY = fromY + (deltaY > 0 ? margin : -margin)
  }

  return { x: waypointX, y: waypointY }
}
