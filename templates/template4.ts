import { circuit } from "lib/builder"

/**
 * ```
 *
 *      0.0         5.0
 *  2.6             A
 *  2.4             │
 *  2.2             │
 *  2.0             │
 *  1.8             │
 *  1.6             │
 *  1.4             │
 *  1.2             │
 *  1.0 U1          │
 *  0.8 ┌────┐      │
 *  0.6 │   3├──────┤
 *  0.4 │   2├──C   │
 *  0.2 │   1├┐     │
 *  0.0 └────┘│     │
 * -0.2       │     │
 * -0.4       │     │
 * -0.6       │     │
 * -0.8       │     │
 * -1.0       │     │
 * -1.2       │     │
 * -1.4       │     ┴
 * -1.6       │
 * -1.8       D     R2
 * -2.0
 * -2.2
 * -2.4             ┬
 * -2.6             │
 * -2.8             │
 * -3.0             │
 * -3.2             │
 * -3.4             │
 * -3.6             │
 * -3.8             │
 * -4.0             │
 * -4.2             │
 * -4.4             B
 *
 * Boxes:
 *
 *
 *                       ┌────────────────┐
 *                       │                │3  ── A,R2.2
 *                       │       U1       │2  ── C
 *                       │                │1  ── D
 *                       └────────────────┘
 *
 *
 *                             U1.3,A
 *                               │
 *                               2
 *                       ┌────────────────┐
 *                       │       R2       │
 *                       └────────────────┘
 *                               1
 *                               │
 *                               B
 *
 * Complex Connections (more than 2 points):
 *   - complex connection[0]:
 *     - U1.3
 *     - A
 *     - R2.2
 * ```
 */
export default () => {
  const C = circuit()
  const U1 = C.chip().rightpins(3)

  U1.pin(3).line(4, 0).mark("m1").line(0, 2).label()
  U1.fromMark("m1").line(0, -2).passive().line(0, -2).label()

  U1.pin(2).line(2, 0).label()
  U1.pin(1).line(1, 0).line(0, -2).label()

  return C
}
