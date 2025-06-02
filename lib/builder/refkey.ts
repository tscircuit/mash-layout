import { PortReference } from "./circuit-types"

export const getRefKey = (ref: PortReference) =>
  "boxId" in ref
    ? `box[${ref.boxId}].${ref.pinNumber}`
    : "junctionId" in ref
      ? `junction[${ref.junctionId}]`
      : `netlabel[${ref.netId},${ref.netLabelId}]`

export const parseRefKey = (refKey: string): PortReference => {
  let match = refKey.match(/^box\[([^\]]+)\]\.(\d+)$/)
  if (match) {
    return { boxId: match[1]!, pinNumber: parseInt(match[2]!) }
  }
  match = refKey.match(/^junction\[([^\]]+)\]$/)
  if (match) {
    return { junctionId: match[1]! }
  }
  match = refKey.match(/^netlabel\[([^\]]+),([^\]]+)\]$/)
  if (match) {
    return { netId: match[1]!, netLabelId: match[2]! }
  }
  throw new Error(`Invalid ref key: ${refKey}`)
}
