import { circuit } from "lib/builder"

/**
 * ```
 *
 *      0.0         5.0
 *  2.4         V
 *  2.2         │
 *  2.0         │
 *  1.8 J1      │
 *  1.6 ┌────┐  │ ┌───R9P
 *  1.4 │   7├──┘ │
 *  1.2 │   6├────┘
 *  1.0 │   5├────────R0M
 *  0.8 │   4├────────┐
 *  0.6 │   3├────┐   │
 *  0.4 │   2├┐   │   │
 *  0.2 │   1├●   ┴   ┴
 *  0.0 └────┘│
 * -0.2       │   R1  R2
 * -0.4       │
 * -0.6       │
 * -0.8       │   ┬   ┬
 * -1.0       │   │   │
 * -1.2       │   │   │
 * -1.4       │   │   │
 * -1.6       │   │   │
 * -1.8       G   G   G
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 2",
  })
  const J1 = C.chip("J1").rightpins(7)

  J1.pin(7).line(2, 0).line(0, 1).label("VUSB")
  J1.pin(6)
    .line(3, 0)
    .line(0, 0.4)
    .line(2, 0)
    .passive("R9")
    .line(1, 0)
    .label("P")
  J1.pin(5).line(5, 0).passive("R0").line(1, 0).label("M")
  J1.pin(4).line(5, 0).line(0, -0.6).passive("R2").line(0, -1).label("GND")
  J1.pin(3).line(3, 0).line(0, -0.4).passive("R1").line(0, -1).label("GND")
  J1.pin(2).line(1, 0).line(0, -2.2).label("GND") // Default label "L"

  // Pin 7 connects to the horizontal segment of Pin 6's trace
  J1.pin(1).line(1, 0).intersect()

  return C
}
