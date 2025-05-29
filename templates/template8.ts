import { circuit } from "lib/builder"

/**
 * ```
 *
 *          0.0
 *  1.2   V U1
 *  1.0   │ ┌────┐
 *  0.8 S─┼─┤1   │
 *  0.6 S─┼─┤2   │
 *  0.4   └─┤3   │
 *  0.2   ┌─┤4   │
 *  0.0   │ └────┘
 * -0.2   G
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 8",
  })

  const U1 = C.chip("U1").leftpins(4).at(0, 0)

  U1.pin(1).line(-2, 0).label("SCL")
  U1.pin(2).line(-2, 0).label("SDA")
  U1.pin(3).line(-1, 0).line(0, 0.8).label("V3_3")
  U1.pin(4).line(-1, 0).line(0, -0.4).label("GND")

  return C
}
