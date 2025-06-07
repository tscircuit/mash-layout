import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"

test("corpus01 - template matching and basic structure", async () => {
  const templateFn = () => circuitBuilderFromLayoutJson(corpus1LayoutJson as any)
  
  const { solver } = await testTscircuitCodeForLayout(corpus1Code, {
    templateFns: [templateFn],
  })

  // Verify the solver completed its matching phase
  expect(solver.matchPhaseSolver?.solved).toBe(true)
  expect(solver.matchPhaseSolver?.outputMatchedTemplates).toHaveLength(1)

  const matchedTemplate = solver.matchPhaseSolver!.outputMatchedTemplates[0]!.template
  const expectedTemplate = templateFn()

  // Templates should match the structure
  expect(matchedTemplate.toString()).toBe(expectedTemplate.toString())

  // Check the original corpus layout structure
  const originalLayoutJson = expectedTemplate.getLayoutJson()
  expect(originalLayoutJson.boxes).toHaveLength(2) // U1 and P1
  expect(originalLayoutJson.boxes.map(b => b.boxId).sort()).toEqual(["P1", "U1"])

  // Verify U1 chip properties in original layout
  const u1Box = originalLayoutJson.boxes.find(b => b.boxId === "U1")
  expect(u1Box).toMatchObject({
    boxId: "U1",
    leftPinCount: 2,
    rightPinCount: 2,
    topPinCount: 0,
    bottomPinCount: 0,
  })

  // Verify P1 passive properties in original layout
  const p1Box = originalLayoutJson.boxes.find(b => b.boxId === "P1")
  expect(p1Box).toMatchObject({
    boxId: "P1",
    leftPinCount: 0,
    rightPinCount: 0,
    topPinCount: 1,
    bottomPinCount: 1,
  })

  // Check that template has lines (internal representation)
  expect(expectedTemplate.lines.length).toBeGreaterThan(0)
  
  // Verify net labels exist in template
  expect(expectedTemplate.netLabels.length).toBeGreaterThan(0)

  // Check for proper structure - template should have expected components
  const templateChips = expectedTemplate.chips
  expect(templateChips).toHaveLength(2) // U1 and P1
  
  const u1Chip = templateChips.find(c => c.chipId === "U1")
  const p1Chip = templateChips.find(c => c.chipId === "P1")
  expect(u1Chip).toBeDefined()
  expect(p1Chip).toBeDefined()

  // Snapshot the template structure for regression testing
  expect(`\n${matchedTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
              0.0   
     3.0   U1
     2.8   ┌─────┐
     2.6   ┤1   N├
     2.4   ┤2   3├
     2.2   └─────┘
     2.0
     1.8 ┴
     1.6
     1.4
     1.2 P1
     1.0 │
     0.8 ┬
     0.6 N
    "
  `)
})