import { InputNetlist, Box, Connection } from "lib/input-types"
import { MatchedBox } from "lib/matching/types"
import { rotateInputBox } from "lib/matching/matching-utils/rotateInputBox"
import { getPinSideIndex } from "lib/builder/getPinSideIndex"

function getPinNumberAfterRotation(
  pinNumber: number,
  originalBox: Box,
  rotationDegrees: 0 | 90 | 180 | 270,
): number {
  if (rotationDegrees === 0) return pinNumber

  // Get the pin's position on the original box
  const { side, indexOnSide } = getPinSideIndex(pinNumber, originalBox)

  // Create the rotated box to understand new pin layout
  const rotatedBox = rotateInputBox(originalBox, rotationDegrees)

  // Map the side to the new side after rotation
  let newSide: string
  switch (rotationDegrees) {
    case 90:
      // CCW rotation: left->top, bottom->left, right->bottom, top->right
      switch (side) {
        case "left":
          newSide = "top"
          break
        case "bottom":
          newSide = "left"
          break
        case "right":
          newSide = "bottom"
          break
        case "top":
          newSide = "right"
          break
        default:
          newSide = side
      }
      break
    case 180:
      // 180 rotation: left->right, right->left, top->bottom, bottom->top
      switch (side) {
        case "left":
          newSide = "right"
          break
        case "right":
          newSide = "left"
          break
        case "top":
          newSide = "bottom"
          break
        case "bottom":
          newSide = "top"
          break
        default:
          newSide = side
      }
      break
    case 270:
      // 270° CCW rotation (90° CW): left->bottom, bottom->right, right->top, top->left
      switch (side) {
        case "left":
          newSide = "bottom"
          break
        case "bottom":
          newSide = "right"
          break
        case "right":
          newSide = "top"
          break
        case "top":
          newSide = "left"
          break
        default:
          newSide = side
      }
      break
    default:
      newSide = side
  }

  // For rotations, we need to handle index reversal based on the direction
  let newIndexOnSide = indexOnSide
  const originalSidePinCount = originalBox[
    `${side}PinCount` as keyof Box
  ] as number

  if (rotationDegrees === 180) {
    // 180 rotation: reverse all indices
    newIndexOnSide = originalSidePinCount - 1 - indexOnSide
  } else if (rotationDegrees === 90) {
    // 90 CCW rotation: left->top (reverse), bottom->left (normal), right->bottom (reverse), top->right (normal)
    if (side === "left" || side === "right") {
      newIndexOnSide = originalSidePinCount - 1 - indexOnSide
    }
  } else if (rotationDegrees === 270) {
    // 270 CCW rotation: left->bottom (reverse), bottom->right (normal), right->top (reverse), top->left (normal)
    if (side === "left" || side === "right") {
      newIndexOnSide = originalSidePinCount - 1 - indexOnSide
    }
  }

  // Now find what pin number this corresponds to on the rotated box
  let currentPinNumber = 1
  const sides = ["left", "bottom", "right", "top"]

  for (const checkSide of sides) {
    const sidePinCount = rotatedBox[
      `${checkSide}PinCount` as keyof Box
    ] as number
    if (!sidePinCount) continue

    if (checkSide === newSide) {
      return currentPinNumber + newIndexOnSide
    }
    currentPinNumber += sidePinCount
  }

  throw new Error(
    `Could not map pin ${pinNumber} after ${rotationDegrees}° rotation`,
  )
}

export function applyMatchedBoxRotationsToInputNetlist(params: {
  inputNetlist: InputNetlist
  matchedBoxes: MatchedBox[]
}): InputNetlist {
  const { inputNetlist, matchedBoxes } = params

  // Create a map of target box indices to their rotations
  const rotationMap = new Map<number, 0 | 90 | 180 | 270>()
  for (const matchedBox of matchedBoxes) {
    rotationMap.set(matchedBox.targetBoxIndex, matchedBox.targetBoxRotationCcw)
  }

  // Apply rotations to boxes
  const rotatedBoxes = inputNetlist.boxes.map((box, index) => {
    const rotation = rotationMap.get(index)
    if (rotation && rotation !== 0) {
      return rotateInputBox(box, rotation)
    }
    return box
  })

  // Update connections to use new pin numbers
  const updatedConnections: Connection[] = inputNetlist.connections.map(
    (connection) => {
      const updatedPorts = connection.connectedPorts.map((port) => {
        if ("boxId" in port) {
          // Find the box index for this boxId
          const boxIndex = inputNetlist.boxes.findIndex(
            (box) => box.boxId === port.boxId,
          )
          if (boxIndex !== -1) {
            const rotation = rotationMap.get(boxIndex)
            if (rotation && rotation !== 0) {
              const originalBox = inputNetlist.boxes[boxIndex]!
              const newPinNumber = getPinNumberAfterRotation(
                port.pinNumber,
                originalBox,
                rotation,
              )
              return { ...port, pinNumber: newPinNumber }
            }
          }
        }
        return port
      })

      return { ...connection, connectedPorts: updatedPorts }
    },
  )

  return {
    ...inputNetlist,
    boxes: rotatedBoxes,
    connections: updatedConnections,
  }
}
