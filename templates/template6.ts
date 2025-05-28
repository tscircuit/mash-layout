import { circuit } from "lib/builder"

/**
 * ```
 *
 *              0.0         5.0
 *  1.4 A                       C
 *  1.2 │                       │
 *  1.0 │       U2              │
 *  0.8 │       ┌────────┐      │
 *  0.6 ├───┬───┤1      6├──────┤
 *  0.4 │   │ ┌─┤2      5├      │
 *  0.2 │   │ │┌┤3      4├      │
 *  0.0 │   │ ││└────────┘      │
 * -0.2 │   │ ││                │
 * -0.4 ┴   ┴ ││                ┴
 * -0.6       ││
 * -0.8 C1  R3││                C2
 * -1.0       ││
 * -1.2       ││
 * -1.4 ┬   ┬ ││                ┬
 * -1.6 │   │ ││                │
 * -1.8 │  B●─┘G                │
 * -2.0 │                       │
 * -2.2 │                       │
 * -2.4 G                       G
 *
 * Boxes:
 *
 *
 *                       ┌────────────────┐
 *      A,C1.2,R3.2 ──  1│                │6  ── C,C2.2
 *           R3.1,B ──  2│       U2       │5
 *    C1.1,GND,C2.1 ──  3│                │4
 *                       └────────────────┘
 *
 *
 *                          U2.1,A,R3.2
 *                               │
 *                               2
 *                       ┌────────────────┐
 *                       │       C1       │
 *                       └────────────────┘
 *                               1
 *                               │
 *                         GND,U2.3,C2.1
 *
 *
 *                          U2.1,A,C1.2
 *                               │
 *                               2
 *                       ┌────────────────┐
 *                       │       R3       │
 *                       └────────────────┘
 *                               1
 *                               │
 *                             B,U2.2
 *
 *
 *                             U2.6,C
 *                               │
 *                               2
 *                       ┌────────────────┐
 *                       │       C2       │
 *                       └────────────────┘
 *                               1
 *                               │
 *                         C1.1,GND,U2.3
 *
 * Complex Connections (more than 2 points):
 *   - complex connection[0]:
 *     - U2.1
 *     - A
 *     - C1.2
 *     - R3.2
 *   - complex connection[1]:
 *     - C1.1
 *     - GND
 *     - U2.3
 *     - C2.1
 *   - complex connection[2]:
 *     - R3.1
 *     - B
 *     - U2.2
 *   - complex connection[3]:
 *     - U2.6
 *     - C
 *     - C2.2
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 6",
  })

  const U2 = C.chip("U2").leftpins(3).rightpins(3).at(0, 0)

  U2.pin(1) // IN
    .line(-2, 0)
    .mark("vin1")
    .line(-2, 0)
    .mark("vin2")
    .line(0, 0.8)
    .label()

  U2.fromMark("vin2").line(0, -1).passive("C1").line(0, -1).label("GND")

  U2.fromMark("vin1")
    .line(0, -1)
    .passive("R3")
    .line(0, -0.4)
    .mark("en1")
    .line(-0.5, 0)
    .label()

  U2.pin(2).line(-1, 0).intersectAtMark("en1")
  U2.pin(3).line(-0.5, 0).line(0, -2).label("GND")

  U2.pin(6) // OUT
    .line(4, 0)
    .mark("VOUT")
    .line(0, -1)
    .passive("C2")
    .line(0, -1)
    .label("GND")
  U2.fromMark("VOUT").line(0, 0.8).label()

  return C
}
