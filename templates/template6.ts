import { circuit } from "lib/builder"

/**
 * ```
 *              0.0         5.0
 *  1.4 A                       E
 *  1.2 │                       │
 *  1.0 │       U1              │
 *  0.8 │       ┌────────┐      │
 *  0.6 ├───┬───┤1      5├      │
 *  0.4 │   │ ┌─┤2      4├──────┤
 *  0.2 │   │ │┌┤3       │      │
 *  0.0 │   │ ││└────────┘      │
 * -0.2 │   │ ││                │
 * -0.4 ┴   ┴ ││                │
 * -0.6       ││                ┴
 * -0.8 R2  R3││
 * -1.0       ││                R4
 * -1.2       ││
 * -1.4 ┬   ┬ ││
 * -1.6 │   │ ││                ┬
 * -1.8 │  C●─┘D                │
 * -2.0 │                       │
 * -2.2 │                       │
 * -2.4 B                       │
 * -2.6                         G
 * ```
 */
export default () => {
  const C = circuit()

  const U2 = C.chip().leftpins(3).rightpins(2).at(0, 0)

  U2.pin(1) // IN
    .line(-2, 0)
    .mark("vin1")
    .line(-2, 0)
    .mark("vin2")
    .line(0, 0.8)
    .label()

  U2.fromMark("vin2")
    .line(0, -1)
    .passive() // C1
    .line(0, -1)
    .label()

  U2.fromMark("vin1")
    .line(0, -1)
    .passive()
    .line(0, -0.4)
    .mark("en1")
    .line(-0.5, 0)
    .label()

  U2.pin(2).line(-1, 0).intersectAtMark("en1")
  U2.pin(3).line(-0.5, 0).line(0, -2).label()

  U2.pin(4) // OUT
    .line(4, 0)
    .mark("VOUT")
    .line(0, -1)
    .passive() // C2 1 µF
    .line(0, -1)
    .label("GND")
  U2.fromMark("VOUT").line(0, 1).label()

  return C
}
