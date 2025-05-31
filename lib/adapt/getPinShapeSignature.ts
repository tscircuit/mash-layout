import type { InputNetlist } from "lib/input-types"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getPinSubsetNetlist } from "./getPinSubsetNetlist"

export const getBoxShapeSignature = (params: {
  leftPinCount: number
  bottomPinCount: number
  rightPinCount: number
  topPinCount: number
}): string => {
  return [
    params.leftPinCount > 0 ? `L${params.leftPinCount}` : "",
    params.bottomPinCount > 0 ? `B${params.bottomPinCount}` : "",
    params.rightPinCount > 0 ? `R${params.rightPinCount}` : "",
    params.topPinCount > 0 ? `T${params.topPinCount}` : "",
  ].join("")
}

export const getBoxCountPinSignature = (params: {
  netlist: InputNetlist
  chipId: string
  pinNumber: number
}): string => {
  const { netlist, chipId, pinNumber } = params

  // Count unique boxes connected to this pin
  const connectedBoxes = new Set<string>()

  for (const connection of netlist.connections) {
    const hasThisPin = connection.connectedPorts.some(
      (port) =>
        "boxId" in port &&
        port.boxId === chipId &&
        port.pinNumber === pinNumber,
    )

    if (hasThisPin) {
      for (const port of connection.connectedPorts) {
        if ("boxId" in port && port.boxId !== chipId) {
          connectedBoxes.add(port.boxId)
        }
      }
    }
  }

  return `box_count_${connectedBoxes.size}`
}

export const getPinShapeSignature = (
  params:
    | {
        netlist: InputNetlist
        chipId: string
        pinNumber: number
      }
    | { pinShapeNetlist: InputNetlist },
): string => {
  let pinShapeNetlist: InputNetlist

  if ("pinShapeNetlist" in params) {
    pinShapeNetlist = params.pinShapeNetlist
  } else {
    const { netlist, chipId, pinNumber } = params

    pinShapeNetlist = getPinSubsetNetlist({
      chipId,
      pinNumber,
      netlist,
    })
  }

  const normNetlist = normalizeNetlist(pinShapeNetlist)

  return `${normNetlist.normalizedNetlist.boxes
    .map((b) => getBoxShapeSignature(b))
    .join(",")}`
  // TODO for some reason, the pin numbers become messed up
  // +
  // `|C${normNetlist.normalizedNetlist.connections
  // .map(
  //   (c) =>
  //     `[${c.connectedPorts
  //       .filter((cp) => "boxIndex" in cp)
  //       // TODO don't use the boxIndex, re-index the boxes by their size (except
  //       // keeping the "owner" box index always the first), only index boxes that
  //       // appear in the connection
  //       .map((cp) => `b${cp.boxIndex}.${cp.pinNumber}`)
  //       .join(",")}]`,
  // )
  // .join(",")}`
}
