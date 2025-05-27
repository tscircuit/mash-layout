import type { CircuitBuilder } from "lib/builder"
import template1 from "./template1"
import template2 from "./template2"
import template3 from "./template3"
import template4 from "./template4"
import template5 from "./template5"
import template6 from "./template6"

export const TEMPLATE_FN_MAP = {
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
} satisfies Record<string, () => CircuitBuilder>

export const TEMPLATE_FNS: Array<() => CircuitBuilder> =
  Object.values(TEMPLATE_FN_MAP)
