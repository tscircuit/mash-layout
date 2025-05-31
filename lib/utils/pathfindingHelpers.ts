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
  // Strategy: try to route around obstacles by going above or below them

  // Find the highest obstacle Y coordinate that might block our path
  let maxObstacleY = -Infinity
  let minObstacleY = Infinity

  for (const chip of circuit.chips) {
    if (chip.chipId === excludeChipId) continue

    const width = chip.getWidth()
    const height = chip.getHeight()
    const margin = 0.1

    // Check if this obstacle is roughly between our start and end points
    const obstacleLeft = chip.x - width / 2 - margin
    const obstacleRight = chip.x + width / 2 + margin
    const obstacleTop = chip.y + height / 2 + margin
    const obstacleBottom = chip.y - height / 2 - margin

    const pathLeft = Math.min(fromX, targetX)
    const pathRight = Math.max(fromX, targetX)

    // If obstacle overlaps with our X range, note its Y bounds
    if (obstacleRight > pathLeft && obstacleLeft < pathRight) {
      maxObstacleY = Math.max(maxObstacleY, obstacleTop)
      minObstacleY = Math.min(minObstacleY, obstacleBottom)
    }
  }

  // If we found obstacles in our path, route around them
  if (maxObstacleY !== -Infinity) {
    // Try routing above obstacles
    const routeAboveY = maxObstacleY + 0.5
    if (
      !isPointInObstacle(fromX, routeAboveY, circuit, excludeChipId) &&
      !isPointInObstacle(targetX, routeAboveY, circuit, excludeChipId)
    ) {
      return { x: fromX, y: routeAboveY } // Go up first, then across
    }

    // Try routing below obstacles
    const routeBelowY = minObstacleY - 0.5
    if (
      !isPointInObstacle(fromX, routeBelowY, circuit, excludeChipId) &&
      !isPointInObstacle(targetX, routeBelowY, circuit, excludeChipId)
    ) {
      return { x: fromX, y: routeBelowY } // Go down first, then across
    }
  }

  // Fallback: try basic L-shaped routing
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

  // Last resort: move diagonally away from obstacles
  const deltaX = targetX - fromX
  const deltaY = targetY - fromY
  let margin = 1.0

  while (margin < 4.0) {
    const waypointX = fromX + (deltaX > 0 ? margin : -margin)
    const waypointY = fromY + (deltaY > 0 ? margin : -margin)

    if (!isPointInObstacle(waypointX, waypointY, circuit, excludeChipId)) {
      return { x: waypointX, y: waypointY }
    }
    margin += 0.5
  }

  // Ultimate fallback - just return current position
  return { x: fromX, y: fromY }
}
