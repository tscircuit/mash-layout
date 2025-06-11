import { test, expect } from "bun:test"
import template3 from "../templates/template3"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"

test("template3", () => {
  const C = template3()
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         
     1.6                   A
     1.4                   │
     1.2                   │
     1.0 U1                │
     0.8 ┌────┐            │
     0.6 │   3├──────●─────┴
     0.4 │   2├──┐   │     │
     0.2 │   1├┐ │   │     │
     0.0 └────┘│ │   │     R2
    -0.2       │ │   │     │
    -0.4       │ │   │     ┬
    -0.6       │ │   │     │
    -0.8       │ │   │     │
    -1.0       │ │   │     │
    -1.2       │ │   │     │
    -1.4       │ │   ┴     │
    -1.6       │ │         │
    -1.8       │ │         │
    -2.0       │ │   R3    │
    -2.2       │ │         │
    -2.4       │ │   ┬     │
    -2.6       │ │   │     │
    -2.8       C │   │     │
    -3.0         │   │     │
    -3.2         │   │     │
    -3.4         │   │     B
    -3.6         └───┘
    "
  `)
  expect(C.getNetlist()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 0,
          "rightPinCount": 3,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R2",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R3",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
      "connections": [
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 3,
            },
            {
              "netId": "A",
              "netLabelId": "NL1",
            },
            {
              "boxId": "R2",
              "pinNumber": 2,
            },
            {
              "boxId": "R3",
              "pinNumber": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R2",
              "pinNumber": 1,
            },
            {
              "netId": "B",
              "netLabelId": "NL2",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 1,
            },
            {
              "netId": "C",
              "netLabelId": "NL3",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 2,
            },
            {
              "boxId": "R3",
              "pinNumber": 1,
            },
          ],
        },
      ],
      "nets": [
        {
          "netId": "A",
        },
        {
          "netId": "B",
        },
        {
          "netId": "C",
        },
      ],
    }
  `)
  expect(C.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                          ┌────────────────┐
                          │                │3  ── A,R2.2,R3.2   
                          │       U1       │2  ── R3.1          
                          │                │1  ── C             
                          └────────────────┘


                             U1.3,A,R3.2   
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R2       │                    
                          └────────────────┘
                                  1        
                                  │        
                                  B        


                             U1.3,A,R2.2   
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R3       │                    
                          └────────────────┘
                                  1        
                                  │        
                                 U1.2      

    Complex Connections (more than 2 points):
      - complex connection[0]:
        - U1.3
        - A
        - R2.2
        - R3.2"
  `)
})
