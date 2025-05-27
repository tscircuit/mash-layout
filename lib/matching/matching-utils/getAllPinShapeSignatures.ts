import type { InputNetlist } from "lib/input-types"
import { getPinShapeSignature } from "lib/adapt/getPinShapeSignature"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"

export const getAllPinShapeSignatures = (
  inputNetlist: InputNetlist,
): Array<{
  boxId: string
  pinNumber: number
  pinShapeSignature: string
}> => {
  const { normalizedNetlist, transform } = normalizeNetlist(inputNetlist)

  const pinShapeSignatures: Array<{
    boxId: string
    pinNumber: number
    pinShapeSignature: string
  }> = []

  for (const box of normalizedNetlist.boxes) {
    // TODO
  }

  return pinShapeSignatures
}
