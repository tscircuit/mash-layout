import { circuit } from "lib/builder"
import { test, expect } from "bun:test"

test("default chip width rules", () => {
  const C = circuit()
  const lr = C.chip().leftpins(1).rightpins(1)
  const single = C.chip().leftpins(2)

  expect(lr.getWidth()).toBe(2.8)
  expect(single.getWidth()).toBe(2)
})
