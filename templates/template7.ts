import { circuit } from "lib/builder"

/**
 * ```
 *
 *          0.0         5.0         10.0
 *  1.0     U1                J2
 *  0.8 V   ┌────┐  V         ┌────┐
 *  0.6 └─┬─┤1  6├──┴─┬───────┤1   │
 *  0.4   ┴ ┤2  5├──┐ │   ┌───┤2   │
 *  0.2     ┤3  4├┐ ┴ ┴   │   └────┘
 *  0.0     ┴────┘│       │
 * -0.2   D4      │ R6    │
 * -0.4     R5    │   C4  │
 * -0.6   ┬       │       │
 * -0.8   │       │ ┬ ┬   │
 * -1.0   │ ┬     └─┴─┴───┤
 * -1.2   └─┘             G
 * ```
 */
export default () => {
  const C = circuit({
    name: "Template 7",
  })

  const U1 = C.chip("U1").leftpins(3).rightpins(3).at(0, 0)
  const J2 = C.chip("J2").leftpins(2).at(9, 0.2)

  U1.pin(1)
    .line(-1, 0)
    .mark("VUSB1")
    .line(-1, 0)
    .mark("VUSB2")
    .line(0, 0.2)
    .label("VUSB")

  U1.fromMark("VUSB1").line(0, -0.2).passive("D4").line(0, -0.2).mark("belowD4")

  U1.pin(3)
    .line(-0.2, 0)
    .line(0, -0.2)
    .passive("R5")
    .line(0, -0.2)
    .connectToMark("belowD4")

  U1.pin(4)
    .line(1, 0)
    .line(0, -1.2)
    .line(1, 0)
    .mark("GND1")
    .line(1, 0)
    .mark("GND2")
    .line(2, 0)
    .mark("aboveGND")
    .line(0, -0.2)
    .label("GND")
  U1.pin(5).line(2, 0).line(0, -0.2).passive("R6").connectToMark("GND1")

  U1.pin(6).line(2, 0).mark("belowVBat").line(1, 0).mark("aboveC4")
  U1.fromMark("belowVBat").line(0, 0.2).label("VBAT")

  J2.pin(1).connectToMark("aboveC4")

  U1.fromMark("aboveGND").line(0, 0.8).mark("aboveGND2")

  U1.fromMark("aboveC4").line(0, -0.4).passive("C4").connectToMark("GND2")

  J2.pin(2).connectToMark("aboveGND2")

  return C
}
