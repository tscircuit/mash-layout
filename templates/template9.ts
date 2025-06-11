import { circuit } from "lib/builder"

/**
 * ```
 *
 *        0.0         5.0
 *  2.6         V
 *  2.4         ┴ V
 *  2.2           │
 *  2.0         R1│
 *  1.8           │
 *  1.6   U3      │
 *  1.4 V ┌────┐┬ │
 *  1.2 ┴─┤1 12├┴─┼─D
 *  1.0   ┤2 11├──┼─C
 *  0.8   ┤3 10├──┼─B
 *  0.6 C2┤4  9├──┼─A
 *  0.4   ┤5  8├──●
 *  0.2 ┬─┤6  7├──┘
 *  0.0 G └────┘
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 9",
  })

  const U3 = C.chip("U3").leftpins(6).rightpins(6)

  U3.pin(1)
    .line(-1, 0)
    .mark("aboveC2")
    .line(0, -0.001)
    .passive("C20")
    .line(0, -0.001)
    .mark("GND1")
    .line(0, -0.2)
    .label("GND")

  U3.fromMark("aboveC2").line(0, 0.2).label("V3_3")

  U3.pin(6).intersectAtMark("GND1")

  U3.pin(7).line(2, 0).line(0, 0.2).mark("rightOf7").line(0, 2).label("V3_3")
  U3.pin(8).intersectAtMark("rightOf7")

  U3.pin(9).line(3, 0).label()
  U3.pin(10).line(3, 0).label()
  U3.pin(11).line(3, 0).label()
  U3.pin(12).line(1, 0).mark("rightOfNCS").line(2, 0).label()
  console.log("OK START")
  U3.fromMark("rightOfNCS")
    .line(0, 0.2)
    .passive("R11")
    .line(0, 0.2)
    .label("V3_3")

  return C
}
