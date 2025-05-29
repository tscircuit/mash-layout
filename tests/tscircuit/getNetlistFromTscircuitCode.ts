import { runTscircuitCode } from "@tscircuit/eval"
import { cju } from "@tscircuit/circuit-json-util"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import type { InputNetlist } from "lib/input-types"

export const getNetlistFromTscircuitCode = async (
  code: string,
): Promise<InputNetlist> => {
  const circuitJson: any[] = await runTscircuitCode(code)

  // HACK: Add schematic_net_label_id since core doesn't add it currently
  let schLabelIdCounter = 0
  for (const schLabel of cju(circuitJson).schematic_net_label.list()) {
    // @ts-expect-error until circuit-json adds schematic_net_label_id
    schLabel.schematic_net_label_id ??= `schematic_net_label_${schLabelIdCounter++}`
  }

  return convertCircuitJsonToInputNetlist(circuitJson)
}
