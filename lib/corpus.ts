import corpus from "./corpus-vfs"
import type { CircuitLayoutJson } from "./output-types"
import type { CircuitTemplateFn } from "templates/index"
import { circuitBuilderFromLayoutJson } from "./utils/circuitBuilderFromLayoutJson"

const layouts: Record<string, CircuitLayoutJson> = corpus as any

export const CORPUS_TEMPLATE_FNS: CircuitTemplateFn[] = Object.values(
  layouts,
).map((layout) => () => circuitBuilderFromLayoutJson(layout))
