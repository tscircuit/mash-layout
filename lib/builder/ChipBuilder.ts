import type { Side } from "."
import { PinBuilder } from "./PinBuilder"
import type { CircuitBuilder } from "./CircuitBuilder/CircuitBuilder"
import { getPinSideIndex } from "./getPinSideIndex"

interface MakePinParams {
  side: Side
  indexOnSide: number
  ccwPinNumber: number
}

export class ChipBuilder {
  public x = 0
  public y = 0
  public leftPins: PinBuilder[] = []
  public rightPins: PinBuilder[] = []
  public topPins: PinBuilder[] = []
  public bottomPins: PinBuilder[] = []
  public leftPinCount = 0
  public rightPinCount = 0
  public topPinCount = 0
  public bottomPinCount = 0
  private pinMap: Record<string, PinBuilder> = {}
  public marks: Record<string, { pinBuilder: PinBuilder; state: any }> = {}
  public pinMargins: Record<number, { marginTop: number; marginLeft: number }> =
    {}

  constructor(
    public readonly circuit: CircuitBuilder,
    public readonly chipId: string,
    public readonly isPassive: boolean = false,
  ) {}

  at(x: number, y: number): this {
    this.x = x
    this.y = y
    return this
  }

  private makePin({
    side,
    indexOnSide,
    ccwPinNumber,
  }: MakePinParams): PinBuilder {
    const pb = new PinBuilder(this, ccwPinNumber)
    this.pinMap[`${side}${indexOnSide}`] = pb
    return pb
  }

  leftpins(count: number): this {
    if (this.pinPositionsAreSet) {
      throw new Error("Pin positions are already set, cannot add new pins")
    }
    this.leftPinCount = count
    // Pins are created and stored in this.leftPins in visual top-to-bottom order.
    // Pin 1 (if on the left side) is the topmost.
    // OffsetY needs to be higher for topmost pins.
    // If count = 2:
    //   i=0 (topmost pin, e.g. Pin 1): ccwPinNumber=1. offsetY should be 2 (or count).
    //   i=1 (next pin down, e.g. Pin 2): ccwPinNumber=2. offsetY should be 1.
    for (let i = 0; i < count; ++i) {
      // i is the 0-indexed visual position from the top of the left side.
      const ccwPinNumber = i + 1
      const pb = this.makePin({
        side: "left",
        indexOnSide: i,
        ccwPinNumber,
      })
      this.leftPins.push(pb)
    }
    return this
  }

  rightpins(count: number): this {
    if (this.pinPositionsAreSet) {
      throw new Error("Pin positions are already set, cannot add new pins")
    }
    this.rightPinCount = count
    for (let i = 0; i < count; ++i) {
      // right side: pins are numbered bottom-to-top.
      // i = 0 corresponds to the bottom-most pin on this side.
      // offsetY should be i + 1 (1 for bottom-most, up to 'count' for top-most).
      const ccwPinNumber = this.leftPinCount + this.bottomPinCount + i + 1
      const pb = this.makePin({
        side: "right",
        indexOnSide: i,
        ccwPinNumber,
      })
      this.rightPins.push(pb)
    }
    return this
  }

  toppins(count: number): this {
    if (this.pinPositionsAreSet) {
      throw new Error("Pin positions are already set, cannot add new pins")
    }
    this.topPinCount = count
    for (let i = 0; i < count; ++i) {
      // top side: left to right, ccwPinNumber increases
      const ccwPinNumber =
        this.leftPinCount + this.bottomPinCount + this.rightPinCount + i + 1
      const pb = this.makePin({
        side: "top",
        indexOnSide: i,
        ccwPinNumber,
      })
      this.topPins.push(pb)
    }
    return this
  }

  bottompins(count: number): this {
    if (this.pinPositionsAreSet) {
      throw new Error("Pin positions are already set, cannot add new pins")
    }
    this.bottomPinCount = count
    for (let i = 0; i < count; ++i) {
      // bottom side: right to left, ccwPinNumber increases
      const ccwPinNumber = this.leftPinCount + i + 1
      const pb = this.makePin({
        side: "bottom",
        indexOnSide: i,
        ccwPinNumber,
      })
      this.bottomPins.push(pb)
    }
    return this
  }

  getWidth(): number {
    if (this.isPassive) {
      // Horizontal passive (left-right pins) uses defaultPassiveWidth
      // Vertical passive (top-bottom pins) uses defaultPassiveHeight
      const isHorizontal = this.leftPinCount > 0 || this.rightPinCount > 0
      return isHorizontal
        ? this.circuit.defaultPassiveWidth
        : this.circuit.defaultPassiveHeight
    }

    // Check if chip has pins on only one side
    const sideCount = [
      this.leftPinCount > 0 ? 1 : 0,
      this.rightPinCount > 0 ? 1 : 0,
      this.topPinCount > 0 ? 1 : 0,
      this.bottomPinCount > 0 ? 1 : 0,
    ].reduce((sum, count) => sum + count, 0)

    if (sideCount === 1) {
      return this.circuit.defaultSingleSidedChipWidth
    }

    return this.circuit.defaultChipWidth
  }

  getHeight(): number {
    if (this.isPassive) {
      // Horizontal passive (left-right pins) uses defaultPassiveHeight
      // Vertical passive (top-bottom pins) uses defaultPassiveWidth
      const isHorizontal = this.leftPinCount > 0 || this.rightPinCount > 0
      return isHorizontal
        ? this.circuit.defaultPassiveHeight
        : this.circuit.defaultPassiveWidth
    }
    return (
      Math.max(this.leftPinCount, this.rightPinCount) *
        this.circuit.defaultPinSpacing +
      this.circuit.defaultPinSpacing * 2
    )
  }

  getCenter(): { x: number; y: number } {
    if (this.isPassive) {
      return {
        x: this.x,
        y: this.y,
      }
    }
    return {
      x: this.x + this.getWidth() / 2,
      y: this.y + this.getHeight() / 2,
    }
  }

  get totalPinCount(): number {
    return (
      this.leftPinCount +
      this.rightPinCount +
      this.topPinCount +
      this.bottomPinCount
    )
  }

  setPinPositions(): void {
    for (let pn = 1; pn <= this.totalPinCount; pn++) {
      const pb = this._getPin(pn)
      const pinLocation = this.getPinLocation(pn)
      pb.x = pinLocation.x
      pb.y = pinLocation.y
    }
    this.pinPositionsAreSet = true
  }

  pinPositionsAreSet = false

  private _getPin(pinNumber: number): PinBuilder {
    let n = pinNumber
    if (n <= this.leftPins.length) return this.leftPins[n - 1]!
    n -= this.leftPins.length
    if (n <= this.bottomPins.length) return this.bottomPins[n - 1]!
    n -= this.bottomPins.length
    if (n <= this.rightPins.length) return this.rightPins[n - 1]!
    n -= this.rightPins.length
    if (n <= this.topPins.length) return this.topPins[n - 1]!
    throw new Error(`Pin number ${pinNumber} not found`)
  }

  pin(pinNumber: number): PinBuilder {
    if (!this.pinPositionsAreSet) {
      this.setPinPositions()
    }
    // Find the pin by its 1-based ccwPinNumber by checking sides in order: Left, Bottom, Right, Top
    const pb = this._getPin(pinNumber)
    // Reset the junctionId since we're directly accessing the pin
    pb.fromJunctionId = null
    return pb
  }

  public getPinLocation(pinNumber: number): { x: number; y: number } {
    const { side, indexFromTop, indexFromLeft } = getPinSideIndex(
      pinNumber,
      this,
    )

    if (this.isPassive) {
      const dx =
        (this.leftPinCount > 0 ? this.getWidth() / 2 : 0) *
        (pinNumber === 1 ? 1 : -1)
      const dy =
        (this.bottomPinCount > 0 ? this.getHeight() / 2 : 0) *
        (pinNumber === 2 ? 1 : -1)
      return { x: this.x + dx, y: this.y + dy }
    }

    let pinX: number
    let pinY: number
    const spacing = this.circuit.defaultPinSpacing
    const defaultMargin = 0.2

    if (side === "left" || side === "right") {
      pinX = this.x + (side === "left" ? 0 : this.getWidth())

      // Use original spacing calculation
      let totalSpacing = indexFromTop! * spacing

      // Add extra spacing from pin margins (including current pin's margin)
      for (let i = 0; i <= indexFromTop!; i++) {
        const currentPinNumber = this.getPinNumberFromSideIndex(side, i)
        const currentMargin = this.pinMargins[currentPinNumber]
        if (
          currentMargin?.marginTop &&
          currentMargin.marginTop > defaultMargin
        ) {
          // Margins represent actual spacing units, not multipliers
          totalSpacing += currentMargin.marginTop - defaultMargin
        }
      }

      pinY =
        this.y +
        this.getHeight() -
        totalSpacing -
        this.circuit.defaultPinSpacing * 2
    } else {
      // top or bottom
      let totalSpacing = indexFromLeft! * spacing

      // Add extra spacing from pin margins (including current pin's margin)
      for (let i = 0; i <= indexFromLeft!; i++) {
        const currentPinNumber = this.getPinNumberFromSideIndex(side, i)
        const currentMargin = this.pinMargins[currentPinNumber]
        if (
          currentMargin?.marginLeft &&
          currentMargin.marginLeft > defaultMargin
        ) {
          // Margins represent actual spacing units, not multipliers
          totalSpacing += currentMargin.marginLeft - defaultMargin
        }
      }

      pinX = this.x + totalSpacing
      pinY = this.y + (side === "bottom" ? 0 : this.getHeight())
    }
    return { x: pinX, y: pinY }
  }

  addMark(name: string, pinBuilder: PinBuilder): void {
    this.marks[name] = { pinBuilder, state: pinBuilder.getMarkableState() }
  }

  fromMark(name: string): PinBuilder {
    if (!this.marks[name]) {
      throw new Error(`Mark "${name}" not found`)
    }
    const { pinBuilder, state } = this.marks[name]

    // TODO if there isn't already a connectionPoint here, create one
    const junction = this.circuit.addJunction({
      x: state.x,
      y: state.y,
      pinRef: this.marks[name].pinBuilder.ref,
    })

    pinBuilder.applyMarkableState(state)
    pinBuilder.fromJunctionId = junction.junctionId
    return pinBuilder
  }

  public getPinNumberFromSideIndex(side: Side, indexOnSide: number): number {
    let pinNumber = 1

    // Add pins from previous sides in CCW order
    if (side === "bottom" || side === "right" || side === "top") {
      pinNumber += this.leftPinCount
    }
    if (side === "right" || side === "top") {
      pinNumber += this.bottomPinCount
    }
    if (side === "top") {
      pinNumber += this.rightPinCount
    }

    // Add the index on the current side
    pinNumber += indexOnSide

    return pinNumber
  }
}
