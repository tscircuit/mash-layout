import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"

test("net properties propagate", () => {
  const C = circuit()
  const U1 = C.chip().leftpins(2)
  U1.pin(1).line(-1, 0).label("GND")
  U1.pin(2).line(1, 0).label("VCC")

  const netlist = C.getNetlist()
  const gnd = netlist.nets.find((n) => n.netId === "GND")!
  const vcc = netlist.nets.find((n) => n.netId === "VCC")!

  expect(gnd.isGround).toBe(true)
  expect(gnd.isPositivePower).toBeFalsy()
  expect(vcc.isPositivePower).toBe(true)
  expect(vcc.isGround).toBeFalsy()

  const { normalizedNetlist, transform } = normalizeNetlist(netlist)
  const gndIndex = transform.netIdToNetIndex["GND"]!
  const vccIndex = transform.netIdToNetIndex["VCC"]!

  expect(normalizedNetlist.nets[gndIndex]!.isGround).toBe(true)
  expect(normalizedNetlist.nets[vccIndex]!.isPositivePower).toBe(true)
})
