import { CircuitBuilder } from "./CircuitBuilder/CircuitBuilder"

export function circuit(
  opts: {
    name?: string
  } = {},
): CircuitBuilder {
  return new CircuitBuilder({
    name: opts.name,
  })
}
export default circuit
