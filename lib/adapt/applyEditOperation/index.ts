import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "../EditOperation"
import { applyAddLabelToPin } from "./applyAddLabelToPin"
import { applyClearPin } from "./applyClearPin"
import { applyAddPassiveToPin } from "./applyAddPassiveToPin"
import { applyAddPassiveWithLabelToPin } from "./applyAddPassiveWithLabelToPin"
import { applyRemoveChip } from "./applyRemoveChip"
import { applyRemovePinFromSide } from "./applyRemovePinFromSide"
import { applyAddPinToSide } from "./applyAddPinToSide"
import { applyChangePassiveOrientation } from "./applyChangePassiveOrientation"
import { applyDrawLineBetweenPins } from "./applyDrawLineBetweenPins"

/**
 * Mutates the circuit builder, applying the edit operation
 */
export function applyEditOperation(C: CircuitBuilder, op: EditOperation): void {
  switch (op.type) {
    case "add_label_to_pin":
      applyAddLabelToPin(C, op)
      break
    case "add_passive_to_pin":
      applyAddPassiveToPin(C, op)
      break
    case "add_passive_with_label_to_pin":
      applyAddPassiveWithLabelToPin(C, op)
      break
    case "clear_pin":
      applyClearPin(C, op)
      break
    case "add_pin_to_side":
      applyAddPinToSide(C, op)
      break
    case "remove_pin_from_side":
      applyRemovePinFromSide(C, op)
      break
    case "remove_chip":
      applyRemoveChip(C, op)
      break
    case "change_passive_orientation":
      applyChangePassiveOrientation(C, op)
      break
    case "draw_line_between_pins":
      applyDrawLineBetweenPins(C, op)
      break
  }
}
