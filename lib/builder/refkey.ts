import { PortReference } from "./circuit-types"

export const getRefKey = (ref: PortReference) =>
  "boxId" in ref
    ? `box[${ref.boxId}].${ref.pinNumber}`
    : "junctionId" in ref
      ? `junction[${ref.junctionId}]`
      : `net[${ref.netId}]`

export const parseRefKey = (refKey: string): PortReference => {
  let match = refKey.match(/^box\[([^\]]+)\]\.(\d+)$/)
  if (match) {
    return { boxId: match[1]!, pinNumber: parseInt(match[2]!) }
  }
  match = refKey.match(/^junction\[([^\]]+)\]$/)
  if (match) {
    return { junctionId: match[1]! }
  }
  match = refKey.match(/^net\[([^\]]+)\]$/)
  if (match) {
    return { netId: match[1]! }
  }
  throw new Error(`Invalid ref key: ${refKey}`)
}
