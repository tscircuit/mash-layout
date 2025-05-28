import { circuit } from "lib/builder"

/**
 * ```
 *
 *      0.0         5.0         10.0
 *  0.8 U1                  U2
 *  0.6 ┌────┐              ┌────┐
 *  0.4 ┤1  4├──────────────┤1  2├
 *  0.2 ┤2  3├              └────┘
 *  0.0 └────┘
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 5",
  })
  const U1 = C.chip().leftpins(2).rightpins(2).at(0, 0)
  const U2 = C.chip().leftpins(1).rightpins(1).at(10, 0.2)

  U1.pin(4).line(3, 0).mark("bus")
  U2.pin(1).connectToMark("bus")

  return C
}
