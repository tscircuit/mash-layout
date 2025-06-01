import type { PortReference, Side } from "../input-types"
import type { Line, Path } from "./circuit-types"
import type { CircuitBuilder } from "./CircuitBuilder/CircuitBuilder"
import { getPinSideIndex } from "./getPinSideIndex"
import { SimplePathfinder, type Obstacle } from "../utils/SimplePathfinder"
import { isPathClear, findClearWaypoint } from "../utils/pathfindingHelpers"

export interface PinConnectionState {
  x: number
  y: number
  lastConnected: PortReference | null
  lastDx: number
  lastDy: number
}

export class PinBuilder {
  /* location (absolute coords inside circuit grid) */
  x = 0
  y = 0
  pathId: string | null = null

  lastConnected: PortReference | null = null
  lastCreatedLine: Line | null = null
  lastDx = 0
  lastDy = 0

  constructor(
    private readonly chip: any, // TODO: Replace with proper ChipBuilder type
    public pinNumber: number,
  ) {}

  private get circuit(): CircuitBuilder {
    return this.chip["circuit"]
  }

  line(dx: number, dy: number): this {
    if (!this.pathId) {
      this.pathId = this.circuit.addPath().pathId
    }
    const start = { x: this.x, y: this.y, ref: this.ref }
    this.x += dx
    this.y += dy
    const end = { x: this.x, y: this.y, ref: this.ref }
    const line = { start, end, pathId: this.pathId }
    this.circuit.lines.push(line)
    this.lastDx = dx
    this.lastDy = dy
    this.lastCreatedLine = line
    return this
  }

  lineAt(targetX: number, targetY: number): this {
    const deltaX = targetX - this.x
    const deltaY = targetY - this.y

    // If already at target, do nothing
    if (deltaX === 0 && deltaY === 0) {
      return this
    }

    // If only one dimension needs to change, create a single line
    if (deltaX === 0 || deltaY === 0) {
      return this.line(deltaX, deltaY)
    }

    // Two lines needed - determine order based on last direction and pin context
    let firstDirection: "x" | "y"

    // If last point was a pin, move "out of" the pin based on pin direction
    if (this.lastCreatedLine === null) {
      const pinDirection = this.getPinDirection()
      if (pinDirection === "horizontal") {
        firstDirection = "x"
      } else {
        firstDirection = "y"
      }
    } else {
      // Move orthogonal to last line direction to avoid overlap
      if (this.lastDx !== 0) {
        // Last move was horizontal, so move vertical first
        firstDirection = "y"
      } else {
        // Last move was vertical, so move horizontal first
        firstDirection = "x"
      }
    }

    if (firstDirection === "x") {
      return this.line(deltaX, 0).line(0, deltaY)
    } else {
      return this.line(0, deltaY).line(deltaX, 0)
    }
  }

  pathTo(targetX: number, targetY: number): this {
    const currentPos = { x: this.x, y: this.y }
    const targetPos = { x: targetX, y: targetY }

    // If already at target, do nothing
    if (currentPos.x === targetPos.x && currentPos.y === targetPos.y) {
      return this
    }

    // First, check if direct path is clear using fast heuristic check
    if (isPathClear(currentPos, targetPos, this.circuit, this.chip.chipId)) {
      return this.lineAt(targetX, targetY)
    }

    // Try A* pathfinding for complex routing, but with timeout protection
    const pathfinder = new SimplePathfinder()

    // Add all chips as obstacles, excluding the current chip
    for (const chip of this.circuit.chips) {
      if (chip.chipId === this.chip.chipId) {
        continue // Don't treat our own chip as an obstacle
      }

      const width = chip.getWidth()
      const height = chip.getHeight()
      const margin = 0.1 // Small margin around chips

      const obstacle: Obstacle = {
        minX: chip.x - width / 2 - margin,
        maxX: chip.x + width / 2 + margin,
        minY: chip.y - height / 2 - margin,
        maxY: chip.y + height / 2 + margin,
      }
      pathfinder.addObstacle(obstacle)
    }

    // Try pathfinding with reasonable distance constraint
    const distance = Math.abs(targetX - this.x) + Math.abs(targetY - this.y)
    if (distance < 10) {
      // Only use A* for short to medium distances
      const path = pathfinder.findPath(currentPos, targetPos)

      if (path.length > 0) {
        // Draw lines along the calculated path
        for (let i = 1; i < path.length; i++) {
          const point = path[i]!
          const deltaX = point.x - this.x
          const deltaY = point.y - this.y
          this.line(deltaX, deltaY)
        }
        return this
      }
    }

    // Fall back to smart heuristic routing
    const waypoint = findClearWaypoint(
      this.x,
      this.y,
      targetX,
      targetY,
      this.circuit,
      this.chip.chipId,
    )

    return this.lineAt(waypoint.x, waypoint.y).lineAt(targetX, targetY)
  }

  private getPinDirection(): "horizontal" | "vertical" {
    const side = this.side
    // Pins face away from the center of the chip
    // Left/right pins have horizontal direction, top/bottom pins have vertical direction
    return side === "left" || side === "right" ? "horizontal" : "vertical"
  }

  get side(): Side {
    const { side } = getPinSideIndex(this.pinNumber, this.chip)
    return side
  }

  get ref(): PortReference {
    return {
      boxId: this.chip.chipId,
      pinNumber: this.pinNumber,
    }
  }

  passive(name?: string): PinBuilder {
    const entryDirection = this.lastDx === 0 ? "vertical" : "horizontal"

    const passive = this.circuit.passive(name) // Create new passive chip

    if (entryDirection === "horizontal") {
      passive.leftpins(1).rightpins(1)
    } else {
      passive.bottompins(1).toppins(1)
    }

    // Position passive center by projecting half the passive dimension in the line direction
    const halfWidth = passive.getWidth() / 2
    const halfHeight = passive.getHeight() / 2
    // Project by the dimension aligned with the movement direction
    const centerX =
      this.x +
      Math.sign(this.lastDx) * (Math.abs(this.lastDx) > 0 ? halfWidth : 0)
    const centerY =
      this.y +
      Math.sign(this.lastDy) * (Math.abs(this.lastDy) > 0 ? halfHeight : 0)
    passive.at(centerX, centerY)

    const entrySide =
      this.lastDx > 0
        ? "left"
        : this.lastDx < 0
          ? "right"
          : this.lastDy > 0
            ? "bottom"
            : "top"

    const [entryPin, exitPin] =
      entrySide === "left" || entrySide === "bottom"
        ? [passive.pin(1), passive.pin(2)]
        : [passive.pin(2), passive.pin(1)]

    this.lastCreatedLine!.end.ref = entryPin.ref

    return exitPin
  }

  label(text?: string): void {
    const id = text ?? this.circuit.generateAutoLabel()
    this.circuit.netLabels.push({
      labelId: id,
      x: this.x,
      y: this.y,
      anchorSide:
        this.lastDx > 0
          ? "left"
          : this.lastDx < 0
            ? "right"
            : this.lastDy > 0
              ? "bottom"
              : "top",
      fromRef: this.ref,
    })
    this.lastCreatedLine!.end.ref = {
      netId: id,
    }
  }

  connect(): this {
    this.circuit.connectionPoints.push({
      ref: this.ref,
      x: this.x,
      y: this.y,
    })
    return this
  }

  intersect(): this {
    this.circuit.connectionPoints.push({
      ref: this.ref,
      x: this.x,
      y: this.y,
      showAsIntersection: true,
    })
    return this
  }

  intersectsAt(targetX: number, targetY: number): this {
    this.lineAt(targetX, targetY)
    return this.intersect()
  }

  connectToMark(markName: string): this {
    const mark = this.circuit.getMark(markName)
    const markState = mark.state
    this.lineAt(markState.x, markState.y)
    return this.connect()
  }

  intersectAtMark(markName: string): this {
    const mark = this.circuit.getMark(markName)
    const markState = mark.state
    this.lineAt(markState.x, markState.y)
    return this.intersect()
  }

  mark(name: string): this {
    this.chip.addMark(name, this)
    return this
  }

  // Methods for mark/fromMark state management
  getMarkableState(): PinConnectionState {
    // TODO: Implement getMarkableState
    return {
      x: this.x,
      y: this.y,
      lastConnected: this.lastConnected,
      lastDx: this.lastDx,
      lastDy: this.lastDy,
    }
  }

  applyMarkableState(state: PinConnectionState): void {
    // TODO: Implement applyMarkableState
    this.x = state.x
    this.y = state.y
    this.lastConnected = state.lastConnected
    this.lastDx = state.lastDx
    this.lastDy = state.lastDy
    this.pathId = this.circuit.addPath().pathId
  }
}
