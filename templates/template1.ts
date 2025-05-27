import { circuit } from "lib/builder"

/**
 * ```
 *
 *            -5.0         0.0         5.0
 *  0.8                 U1
 *  0.6                 ┌────────┐
 *  0.4 ┌───────────────┤1      4├──────D
 *  0.2 │         ┌─────┤2      3├──────C
 *  0.0 │         │     └────────┘
 * -0.2 │         │
 * -0.4 │         │
 * -0.6 │         │
 * -0.8 │         │
 * -1.0 │         │
 * -1.2 │         │
 * -1.4 │         │
 * -1.6 ┴         │
 * -1.8           B
 * -2.0 R2
 * -2.2
 * -2.4
 * -2.6 ┬
 * -2.8 │
 * -3.0 │
 * -3.2 │
 * -3.4 │
 * -3.6 │
 * -3.8 │
 * -4.0 │
 * -4.2 │
 * -4.4 │
 * -4.6 A
 *
 * Boxes:
 *
 *
 *                   ┌────────────────┐
 *          ... ──  1│       U1       │4  ── D
 *            B ──  2│                │3  ── C
 *                   └────────────────┘
 *
 *
 *
 *                           │
 *                           2
 *                   ┌────────────────┐
 *                   │       R2       │
 *                   └────────────────┘
 *                           1
 *                           │
 *                          ...
 *
 * Complex Connections (more than 2 points):
 *   - Connection 1:
 *     - Box Pin: R2, Pin 1
 *     - Net: A
 *     - Box Pin: U1, Pin 1
 * ```
 */
export default () => {
  const C = circuit()
  const U1 = C.chip().leftpins(2).rightpins(2)
  U1.pin(1).line(-8, 0).line(0, -2).passive().line(0, -2).label()
  U1.pin(2).line(-3, 0).line(0, -2).label()
  U1.pin(3).line(4, 0).label()
  U1.pin(4).line(4, 0).label()

  return C
}
