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
  const pinShapeSignatures: Array<{
    boxId: string
    pinNumber: number
    pinShapeSignature: string
  }> = []

  for (const box of inputNetlist.boxes) {
    const totalPinCount =
      box.leftPinCount +
      box.rightPinCount +
      box.topPinCount +
      box.bottomPinCount

    for (let pinNumber = 1; pinNumber <= totalPinCount; pinNumber++) {
      const pinShapeSignature = getPinShapeSignature({
        netlist: inputNetlist,
        chipId: box.boxId,
        pinNumber,
      })

      pinShapeSignatures.push({
        boxId: box.boxId,
        pinNumber,
        pinShapeSignature,
      })
    }
  }

  return pinShapeSignatures
}
