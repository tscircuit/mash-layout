import { GraphicsObject } from "graphics-debug"

export class BaseSolver {
  MAX_ITERATIONS = 1000
  solved = false
  failed = false
  iterations = 0
  progress = 0
  error: string | null = null
  _activeSubSolver?: BaseSolver | null
  usedSubSolvers: Array<BaseSolver> = []
  failedSubSolvers?: BaseSolver[]
  timeToSolve?: number
  stats: Record<string, any> = {}

  /** DO NOT OVERRIDE! Override _step() instead */
  step() {
    if (this.solved) return
    if (this.failed) return
    this.iterations++
    try {
      this._step()
    } catch (e) {
      this.error = `${this.constructor.name} error: ${e}`
      console.error(this.error)
      this.failed = true
      throw e
    }
    if (!this.solved && this.iterations > this.MAX_ITERATIONS) {
      this.error = `${this.constructor.name} ran out of iterations`
      console.error(this.error)
      this.failed = true
    }
    if ("computeProgress" in this) {
      // @ts-ignore
      this.progress = this.computeProgress() as number
    }
  }

  _step() {}

  get activeSubSolver() {
    return this._activeSubSolver
  }

  getConstructorParams() {
    throw new Error("getConstructorParams not implemented")
  }

  clearActiveSubSolver() {
    this._activeSubSolver = null
  }

  setActiveSubSolver(subSolver: BaseSolver | null) {
    this._activeSubSolver = subSolver
    if (subSolver) {
      this.usedSubSolvers.push(subSolver)
    }
  }

  visualize(): Array<{
    title: string
    graphicsObject?: GraphicsObject
    ascii?: string
  }> {
    return []
  }

  solve() {
    const startTime = Date.now()
    while (!this.solved && !this.failed) {
      this.step()
    }
    const endTime = Date.now()
    this.timeToSolve = endTime - startTime
  }
}
