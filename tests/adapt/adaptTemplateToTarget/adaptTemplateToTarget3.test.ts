import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"

test("adaptTemplateToTarget3 connects two chips with a line", () => {
  /* target circuit (single chip) ------------------------------------- */
  const target = new CircuitBuilder()
  const tU1 = target.chip().leftpins(2).rightpins(2)
  tU1.pin(1).line(-4, 0).passive().line(-2, 0).label()
  tU1.pin(2).line(-2, 0).label()
  tU1.pin(3).line(3, 0).label()
  tU1.pin(4).line(3, 0).label()

  /* template circuit (two chips connected) --------------------------- */
  const template = new CircuitBuilder()
  const eU1 = template.chip().leftpins(2).rightpins(2).at(0, 0)
  const eU2 = template.chip().leftpins(1).rightpins(1).at(10, 1)
  // Connect U1 pin 4 to U2 pin 1
  eU1.pin(4).line(3, 0).mark("bus")
  eU2.pin(1).line(-3, 0).connect()

  expect(`\n${target.toString()}\n`).toMatchInlineSnapshot(`
    "
           -5.0         0.0         5.0  
     0.8             U1
     0.6             ┌─────┐
     0.4 A─R2────────┤1   4├─────D
     0.2         B───┤2   3├─────C
     0.0             └─────┘
    "
  `)

  expect(`\n${template.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0      
     1.6                     U2
     1.4                     ┌─────┐
     1.2               ──────┤1   2├
     1.0                     └─────┘
     0.8 U1
     0.6 ┌─────┐
     0.4 ┤1   4├──────
     0.2 ┤2   3├
     0.0 └─────┘
    "
  `)

  /* run adaptation --------------------------------------------------- */
  const { appliedOperations, outputTemplate } = adaptTemplateToTarget({
    template,
    target: target.getNetlist(),
  })

  expect(appliedOperations).toMatchInlineSnapshot(`
    [
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
      {
        "fromChipId": "U1",
        "fromPinNumber": 1,
        "toChipId": "U2",
        "toPinNumber": 2,
        "type": "draw_line_between_pins",
      },
    ]
  `)

  /* verify adaptation result ----------------------------------------- */
  expect(`\n${outputTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0      
     2.0 ┌─────────────────────────┐
     1.8 │                         │
     1.6 │                   U2    │
     1.4 │                   ┌─────┐
     1.2 │             ──────┤1   2├
     1.0 │                   └─────┘
     0.8 U1
     0.6 ┌─────┐
     0.4 ┤1   4├──────
     0.2 ┤2   3├
     0.0 └─────┘
    "
  `)
})
