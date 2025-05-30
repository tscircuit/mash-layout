import type { InputNetlist } from "lib/input-types"

/**
 * Depth‑first traversal starting from the box with the most pins.
 * Returns {boxId → encounterIter, netId → encounterIter} where the root is 0.
 *
 * The algorithm strictly visits **each box once** to avoid the runaway
 * growth / infinite‑loop behaviour that can happen if we keep pushing
 * pins for boxes we've already explored.
 */
export const buildEncounterMapFromNetlist = (
  netlist: InputNetlist,
): Record<string, number> => {
  /* ---------- helpers ---------- */
  const pinsOfBox = (boxId: string): number[] => {
    const pins = new Set<number>()
    for (const c of netlist.connections) {
      for (const p of c.connectedPorts) {
        if ("boxId" in p && p.boxId === boxId) pins.add(p.pinNumber)
      }
    }
    return Array.from(pins).sort((a, b) => a - b) // CCW ⇒ ascending
  }

  // Pre‑index every pin → the connection(s) it appears in for O(1) access
  const connsByPin = new Map<string, typeof netlist.connections>()
  for (const conn of netlist.connections) {
    for (const p of conn.connectedPorts) {
      if ("boxId" in p) {
        const key = `${p.boxId}|${p.pinNumber}`
        if (!connsByPin.has(key)) connsByPin.set(key, [])
        connsByPin.get(key)!.push(conn)
      }
    }
  }

  /* ---------- pick the root ---------- */
  let rootBoxId = ""
  let maxPinCount = -1
  for (const b of netlist.boxes) {
    const count =
      (b.leftPinCount ?? 0) +
      (b.rightPinCount ?? 0) +
      (b.topPinCount ?? 0) +
      (b.bottomPinCount ?? 0)
    if (count > maxPinCount || (count === maxPinCount && b.boxId < rootBoxId)) {
      rootBoxId = b.boxId
      maxPinCount = count
    }
  }

  /* ---------- DFS ---------- */
  const searchIter: Record<string, number> = { [rootBoxId]: 0 }
  const visitedBoxes = new Set<string>([rootBoxId])
  const visitedNets = new Set<string>() // Keep track of visited nets
  const processedPinKeys = new Set<string>() // avoid re‑processing a pin
  let iter = 1

  // Stack of candidate pins (LIFO). Push pins for a box **once** when we first visit it.
  const stack: { boxId: string; pinNumber: number }[] = []
  const pushPinsOf = (boxId: string) => {
    const pins = pinsOfBox(boxId)
      .slice() // clone
      .reverse() // so smallest pin pops first

    for (const pin of pins) {
      stack.push({ boxId, pinNumber: pin })
    }
  }

  pushPinsOf(rootBoxId)

  while (stack.length) {
    const { boxId, pinNumber } = stack.pop()!
    const pinKey = `${boxId}|${pinNumber}`
    if (processedPinKeys.has(pinKey)) continue // already expanded this pin
    processedPinKeys.add(pinKey)

    const neighbouringBoxes: [string, number][] = [] // [boxId, theirPin]
    const encounteredNetsThisPin = new Set<string>()

    const pinConns = connsByPin.get(pinKey) ?? []
    for (const conn of pinConns) {
      for (const p of conn.connectedPorts) {
        if ("boxId" in p) {
          if (p.boxId !== boxId) {
            neighbouringBoxes.push([p.boxId, p.pinNumber])
          }
        } else if ("netId" in p) {
          encounteredNetsThisPin.add(p.netId)
        }
      }
    }

    // Process newly encountered nets, sorted alphabetically for determinism
    const sortedNewNets = Array.from(encounteredNetsThisPin).sort()
    for (const netId of sortedNewNets) {
      if (!visitedNets.has(netId)) {
        searchIter[netId] = iter++
        visitedNets.add(netId)
      }
    }

    // Keep smallest pin per neighbour, then order by that pin
    const smallestPin: Record<string, number> = {}
    for (const [nbrId, nbrPin] of neighbouringBoxes) {
      smallestPin[nbrId] =
        smallestPin[nbrId] === undefined
          ? nbrPin
          : Math.min(smallestPin[nbrId], nbrPin)
    }

    for (const [nbrId] of Object.entries(smallestPin).sort((a, b) => {
      // Primary sort: by smallest pin number
      if (a[1] !== b[1]) return a[1] - b[1]

      // Secondary sort: by sorted string of all pin numbers this component connects to
      const getConnectedPinsString = (boxId: string): string => {
        const connectedPins = new Set<number>()
        for (const conn of netlist.connections) {
          const thisBoxPort = conn.connectedPorts.find(
            (port) => "boxId" in port && port.boxId === boxId,
          )
          if (thisBoxPort && "pinNumber" in thisBoxPort) {
            // Find what this component connects to
            for (const otherPort of conn.connectedPorts) {
              if (
                otherPort !== thisBoxPort &&
                "boxId" in otherPort &&
                "pinNumber" in otherPort
              ) {
                connectedPins.add(otherPort.pinNumber)
              }
            }
          }
        }
        // Sort pins and join into a string for lexicographic comparison
        return Array.from(connectedPins)
          .sort((a, b) => a - b)
          .join(",")
      }

      const pinsStringA = getConnectedPinsString(a[0])
      const pinsStringB = getConnectedPinsString(b[0])

      return pinsStringA.localeCompare(pinsStringB)
    })) {
      if (!visitedBoxes.has(nbrId)) {
        searchIter[nbrId] = iter++
        visitedBoxes.add(nbrId)
        pushPinsOf(nbrId) // **only once per new box**
      }
    }
  }

  return searchIter
}
