export interface Point {
  x: number
  y: number
}

export interface PathNode {
  point: Point
  gCost: number
  hCost: number
  fCost: number
  parent: PathNode | null
  direction: Direction | null
}

export type Direction = "up" | "down" | "left" | "right"

export interface Obstacle {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const CELL_SIZE = 0.5
const DIRECTION_CHANGE_PENALTY = 0.3

export class SimplePathfinder {
  private obstacles: Obstacle[] = []

  addObstacle(obstacle: Obstacle) {
    this.obstacles.push(obstacle)
  }

  clearObstacles() {
    this.obstacles = []
  }

  findPath(start: Point, end: Point): Point[] {
    const startGrid = this.worldToGrid(start)
    const endGrid = this.worldToGrid(end)

    const openSet = new Set<string>()
    const closedSet = new Set<string>()
    const nodeMap = new Map<string, PathNode>()

    const startNode: PathNode = {
      point: startGrid,
      gCost: 0,
      hCost: this.getHeuristic(startGrid, endGrid),
      fCost: 0,
      parent: null,
      direction: null,
    }
    startNode.fCost = startNode.gCost + startNode.hCost

    const startKey = this.pointToKey(startGrid)
    openSet.add(startKey)
    nodeMap.set(startKey, startNode)

    let iterations = 0
    const maxIterations = 200

    // Calculate max reasonable distance for early termination
    const maxDistance = Math.min(
      this.getHeuristic(startGrid, endGrid) * 2,
      10 / CELL_SIZE,
    )

    while (openSet.size > 0 && iterations < maxIterations) {
      iterations++

      // Find node with lowest fCost
      let currentKey = Array.from(openSet)[0]!
      let currentNode = nodeMap.get(currentKey)!

      for (const key of openSet) {
        const node = nodeMap.get(key)!
        if (
          node.fCost < currentNode.fCost ||
          (node.fCost === currentNode.fCost && node.hCost < currentNode.hCost)
        ) {
          currentKey = key
          currentNode = node
        }
      }

      openSet.delete(currentKey)
      closedSet.add(currentKey)

      // Check if we reached the end
      if (
        currentNode.point.x === endGrid.x &&
        currentNode.point.y === endGrid.y
      ) {
        return this.reconstructPath(currentNode)
      }

      // Early termination if path is getting too long (distance > 10 units)
      if (currentNode.gCost > maxDistance) {
        continue
      }

      // Check neighbors
      const neighbors = this.getNeighbors(currentNode.point)
      for (const neighborPoint of neighbors) {
        const neighborKey = this.pointToKey(neighborPoint)

        if (closedSet.has(neighborKey) || this.isObstacle(neighborPoint)) {
          continue
        }

        const direction = this.getDirection(currentNode.point, neighborPoint)
        let movementCost = 1

        // Add penalty for direction change
        if (currentNode.direction && currentNode.direction !== direction) {
          movementCost += DIRECTION_CHANGE_PENALTY
        }

        const newGCost = currentNode.gCost + movementCost

        if (!openSet.has(neighborKey)) {
          const neighborNode: PathNode = {
            point: neighborPoint,
            gCost: newGCost,
            hCost: this.getHeuristic(neighborPoint, endGrid),
            fCost: 0,
            parent: currentNode,
            direction,
          }
          neighborNode.fCost = neighborNode.gCost + neighborNode.hCost

          openSet.add(neighborKey)
          nodeMap.set(neighborKey, neighborNode)
        } else {
          const existingNode = nodeMap.get(neighborKey)!
          if (newGCost < existingNode.gCost) {
            existingNode.gCost = newGCost
            existingNode.fCost = existingNode.gCost + existingNode.hCost
            existingNode.parent = currentNode
            existingNode.direction = direction
          }
        }
      }
    }

    // No path found (either exhausted open set or hit max iterations)
    if (iterations >= maxIterations) {
      console.warn(`Pathfinding exceeded max iterations (${maxIterations})`)
    }
    return []
  }

  private worldToGrid(point: Point): Point {
    return {
      x: Math.round(point.x / CELL_SIZE),
      y: Math.round(point.y / CELL_SIZE),
    }
  }

  private gridToWorld(point: Point): Point {
    return {
      x: point.x * CELL_SIZE,
      y: point.y * CELL_SIZE,
    }
  }

  private pointToKey(point: Point): string {
    return `${point.x},${point.y}`
  }

  private getHeuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }

  private getNeighbors(point: Point): Point[] {
    return [
      { x: point.x, y: point.y + 1 }, // up
      { x: point.x, y: point.y - 1 }, // down
      { x: point.x - 1, y: point.y }, // left
      { x: point.x + 1, y: point.y }, // right
    ]
  }

  private getDirection(from: Point, to: Point): Direction {
    if (to.y > from.y) return "up"
    if (to.y < from.y) return "down"
    if (to.x < from.x) return "left"
    return "right"
  }

  private isObstacle(point: Point): boolean {
    const worldPoint = this.gridToWorld(point)
    return this.obstacles.some(
      (obstacle) =>
        worldPoint.x >= obstacle.minX &&
        worldPoint.x <= obstacle.maxX &&
        worldPoint.y >= obstacle.minY &&
        worldPoint.y <= obstacle.maxY,
    )
  }

  private reconstructPath(endNode: PathNode): Point[] {
    // Check if total path distance exceeds 10 units
    if (endNode.gCost * CELL_SIZE > 10) {
      return [] // Return empty path if too long
    }

    const path: Point[] = []
    let current: PathNode | null = endNode

    while (current) {
      path.unshift(this.gridToWorld(current.point))
      current = current.parent
    }

    return path
  }
}
