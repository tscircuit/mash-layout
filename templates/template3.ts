import { circuit } from "lib/builder"

/**
 * ```
 *
 *      0.0         5.0
 *  1.6                   A
 *  1.4                   │
 *  1.2                   │
 *  1.0 U1                │
 *  0.8 ┌────┐            │
 *  0.6 │   3├──────●─────┤
 *  0.4 │   2├──┐   │     │
 *  0.2 │   1├┐ │   │     │
 *  0.0 └────┘│ │   │     │
 * -0.2       │ │   │     │
 * -0.4       │ │   │     │
 * -0.6       │ │   │     │
 * -0.8       │ │   │     │
 * -1.0       │ │   │     │
 * -1.2       │ │   │     │
 * -1.4       │ │   ┴     ┴
 * -1.6       │ │
 * -1.8       │ │         R2
 * -2.0       │ │   R3
 * -2.2       │ │
 * -2.4       │ │   ┬     ┬
 * -2.6       │ │   │     │
 * -2.8       C │   │     │
 * -3.0         │   │     │
 * -3.2         │   │     │
 * -3.4         │   │     │
 * -3.6         └───┘     │
 * -3.8                   │
 * -4.0                   │
 * -4.2                   │
 * -4.4                   │
 * -4.6                   │
 * -4.8                   │
 * -5.0                   │
 * -5.2                   │
 * -5.4                   B
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 3",
  })
  const U1 = C.chip().rightpins(3)

  U1.pin(3).line(4, 0).mark("m0").line(3, 0).mark("m1").line(0, 1).label()
  U1.fromMark("m1").line(0, -2).passive().line(0, -3).label()
  U1.pin(2)
    .line(2, 0)
    .line(0, -4)
    .line(2, 0)
    .line(0, 1.2)
    .passive()
    .line(0, 2)
    .intersectAtMark("m0")
  U1.pin(1).line(1, 0).line(0, -3).label()

  return C
}
