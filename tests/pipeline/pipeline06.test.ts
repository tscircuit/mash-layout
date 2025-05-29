import { test, expect } from "bun:test"
import template9 from "templates/template9"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { pipeline06Code } from "website/pages/pipeline/pipeline06.page"

test("pipeline06", async () => {
  const { solver } = await testTscircuitCodeForLayout(pipeline06Code, {
    templateFns: [template9],
  })

  expect(
    solver.matchPhaseSolver!.outputMatchedTemplates,
  ).toMatchInlineSnapshot(`
    [
      {
        "netlist": {
          "boxes": [
            {
              "bottomPinCount": 0,
              "boxId": "U3",
              "leftPinCount": 2,
              "rightPinCount": 6,
              "topPinCount": 0,
            },
            {
              "bottomPinCount": 1,
              "boxId": "C20",
              "leftPinCount": 0,
              "rightPinCount": 0,
              "topPinCount": 1,
            },
            {
              "bottomPinCount": 1,
              "boxId": "R11",
              "leftPinCount": 0,
              "rightPinCount": 0,
              "topPinCount": 1,
            },
          ],
          "connections": [
            {
              "_connectivityNetId": "connectivity_net17",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 0,
                },
                {
                  "boxId": "C20",
                  "pinNumber": 2,
                },
                {
                  "netId": "connectivity_net17",
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net20",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 1,
                },
                {
                  "boxId": "C20",
                  "pinNumber": 1,
                },
                {
                  "netId": "connectivity_net20",
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net25",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                {
                  "boxId": "R11",
                  "pinNumber": 1,
                },
                {
                  "netId": "FLASH_N_CS",
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net11",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 6,
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net8",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 5,
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net5",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 4,
                },
              ],
            },
            {
              "_connectivityNetId": "connectivity_net23",
              "connectedPorts": [
                {
                  "boxId": "U3",
                  "pinNumber": 3,
                },
                {
                  "boxId": "U3",
                  "pinNumber": 2,
                },
                {
                  "boxId": "R11",
                  "pinNumber": 2,
                },
                {
                  "netId": "V3_3",
                },
              ],
            },
          ],
          "nets": [
            {
              "netId": "connectivity_net17",
            },
            {
              "netId": "connectivity_net20",
            },
            {
              "netId": "FLASH_N_CS",
            },
            {
              "netId": "V3_3",
            },
          ],
        },
        "template": CircuitBuilder {
          "autoLabelCounter": 5,
          "chips": [
            ChipBuilder {
              "bottomPinCount": 0,
              "bottomPins": [],
              "chipId": "U3",
              "circuit": [Circular],
              "isPassive": false,
              "leftPinCount": 6,
              "leftPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 2,
                      },
                      "x": -1,
                      "y": 1.1990000000000003,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": 1.2000000000000002,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.001,
                  "pinNumber": 1,
                  "x": -1,
                  "y": 1.1990000000000003,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 2,
                  "x": 0,
                  "y": 1,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 3,
                  "x": 0,
                  "y": 0.8000000000000002,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 4,
                  "x": 0,
                  "y": 0.6,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 5,
                  "x": 0,
                  "y": 0.4,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 6,
                      },
                      "x": -1,
                      "y": 0.1980000000000003,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 6,
                      },
                      "x": -1,
                      "y": 0.20000000000000007,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.0019999999999997797,
                  "pinNumber": 6,
                  "x": -1,
                  "y": 0.1980000000000003,
                },
              ],
              "marks": {
                "rightOf7": {
                  "pinBuilder": PinBuilder {
                    "chip": [Circular],
                    "lastConnected": null,
                    "lastCreatedLine": {
                      "end": {
                        "ref": {
                          "boxId": "U3",
                          "pinNumber": 7,
                        },
                        "x": 4,
                        "y": 2.4,
                      },
                      "start": {
                        "ref": {
                          "boxId": "U3",
                          "pinNumber": 7,
                        },
                        "x": 4,
                        "y": 0.4000000000000001,
                      },
                    },
                    "lastDx": 0,
                    "lastDy": 2,
                    "pinNumber": 7,
                    "x": 4,
                    "y": 2.4,
                  },
                  "state": {
                    "lastConnected": null,
                    "lastDx": 0,
                    "lastDy": 0.2,
                    "x": 4,
                    "y": 0.4000000000000001,
                  },
                },
                "rightOfNCS": {
                  "pinBuilder": PinBuilder {
                    "chip": [Circular],
                    "lastConnected": null,
                    "lastCreatedLine": {
                      "end": {
                        "ref": {
                          "boxId": "R11",
                          "pinNumber": 1,
                        },
                        "x": 3,
                        "y": 1.4000000000000001,
                      },
                      "start": {
                        "ref": {
                          "boxId": "U3",
                          "pinNumber": 12,
                        },
                        "x": 3,
                        "y": 1.2000000000000002,
                      },
                    },
                    "lastDx": 0,
                    "lastDy": 0.2,
                    "pinNumber": 12,
                    "x": 3,
                    "y": 1.4000000000000001,
                  },
                  "state": {
                    "lastConnected": null,
                    "lastDx": 1,
                    "lastDy": 0,
                    "x": 3,
                    "y": 1.2000000000000002,
                  },
                },
              },
              "pinMap": {
                "left0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 2,
                      },
                      "x": -1,
                      "y": 1.1990000000000003,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": 1.2000000000000002,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.001,
                  "pinNumber": 1,
                  "x": -1,
                  "y": 1.1990000000000003,
                },
                "left1": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 2,
                  "x": 0,
                  "y": 1,
                },
                "left2": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 3,
                  "x": 0,
                  "y": 0.8000000000000002,
                },
                "left3": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 4,
                  "x": 0,
                  "y": 0.6,
                },
                "left4": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 5,
                  "x": 0,
                  "y": 0.4,
                },
                "left5": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 6,
                      },
                      "x": -1,
                      "y": 0.1980000000000003,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 6,
                      },
                      "x": -1,
                      "y": 0.20000000000000007,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.0019999999999997797,
                  "pinNumber": 6,
                  "x": -1,
                  "y": 0.1980000000000003,
                },
                "right0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 7,
                      },
                      "x": 4,
                      "y": 2.4,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 7,
                      },
                      "x": 4,
                      "y": 0.4000000000000001,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 2,
                  "pinNumber": 7,
                  "x": 4,
                  "y": 2.4,
                },
                "right1": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 8,
                      },
                      "x": 4,
                      "y": 0.4000000000000001,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 8,
                      },
                      "x": 4,
                      "y": 0.4,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.00000000000000005551115123125783,
                  "pinNumber": 8,
                  "x": 4,
                  "y": 0.4000000000000001,
                },
                "right2": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 9,
                      },
                      "x": 5,
                      "y": 0.6,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 9,
                      },
                      "x": 2,
                      "y": 0.6,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 9,
                  "x": 5,
                  "y": 0.6,
                },
                "right3": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 10,
                      },
                      "x": 5,
                      "y": 0.8000000000000002,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 10,
                      },
                      "x": 2,
                      "y": 0.8000000000000002,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 10,
                  "x": 5,
                  "y": 0.8000000000000002,
                },
                "right4": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 11,
                      },
                      "x": 5,
                      "y": 1,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 11,
                      },
                      "x": 2,
                      "y": 1,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 11,
                  "x": 5,
                  "y": 1,
                },
                "right5": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 1,
                      },
                      "x": 3,
                      "y": 1.4000000000000001,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 12,
                      },
                      "x": 3,
                      "y": 1.2000000000000002,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.2,
                  "pinNumber": 12,
                  "x": 3,
                  "y": 1.4000000000000001,
                },
              },
              "pinPositionsAreSet": true,
              "rightPinCount": 6,
              "rightPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 7,
                      },
                      "x": 4,
                      "y": 2.4,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 7,
                      },
                      "x": 4,
                      "y": 0.4000000000000001,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 2,
                  "pinNumber": 7,
                  "x": 4,
                  "y": 2.4,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 8,
                      },
                      "x": 4,
                      "y": 0.4000000000000001,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 8,
                      },
                      "x": 4,
                      "y": 0.4,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.00000000000000005551115123125783,
                  "pinNumber": 8,
                  "x": 4,
                  "y": 0.4000000000000001,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 9,
                      },
                      "x": 5,
                      "y": 0.6,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 9,
                      },
                      "x": 2,
                      "y": 0.6,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 9,
                  "x": 5,
                  "y": 0.6,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 10,
                      },
                      "x": 5,
                      "y": 0.8000000000000002,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 10,
                      },
                      "x": 2,
                      "y": 0.8000000000000002,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 10,
                  "x": 5,
                  "y": 0.8000000000000002,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 11,
                      },
                      "x": 5,
                      "y": 1,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 11,
                      },
                      "x": 2,
                      "y": 1,
                    },
                  },
                  "lastDx": 3,
                  "lastDy": 0,
                  "pinNumber": 11,
                  "x": 5,
                  "y": 1,
                },
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 1,
                      },
                      "x": 3,
                      "y": 1.4000000000000001,
                    },
                    "start": {
                      "ref": {
                        "boxId": "U3",
                        "pinNumber": 12,
                      },
                      "x": 3,
                      "y": 1.2000000000000002,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.2,
                  "pinNumber": 12,
                  "x": 3,
                  "y": 1.4000000000000001,
                },
              ],
              "topPinCount": 0,
              "topPins": [],
              "x": 0,
              "y": 0,
            },
            ChipBuilder {
              "bottomPinCount": 1,
              "bottomPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": -0.0019999999999997242,
                    },
                    "start": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": 0.1980000000000003,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.2,
                  "pinNumber": 1,
                  "x": -1,
                  "y": -0.0019999999999997242,
                },
              ],
              "chipId": "C20",
              "circuit": [Circular],
              "isPassive": true,
              "leftPinCount": 0,
              "leftPins": [],
              "marks": {
                "GND1": {
                  "pinBuilder": PinBuilder {
                    "chip": [Circular],
                    "lastConnected": null,
                    "lastCreatedLine": {
                      "end": {
                        "ref": {
                          "boxId": "C20",
                          "pinNumber": 1,
                        },
                        "x": -1,
                        "y": -0.0019999999999997242,
                      },
                      "start": {
                        "ref": {
                          "boxId": "C20",
                          "pinNumber": 1,
                        },
                        "x": -1,
                        "y": 0.1980000000000003,
                      },
                    },
                    "lastDx": 0,
                    "lastDy": -0.2,
                    "pinNumber": 1,
                    "x": -1,
                    "y": -0.0019999999999997242,
                  },
                  "state": {
                    "lastConnected": null,
                    "lastDx": 0,
                    "lastDy": -0.001,
                    "x": -1,
                    "y": 0.1980000000000003,
                  },
                },
              },
              "pinMap": {
                "bottom0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": -0.0019999999999997242,
                    },
                    "start": {
                      "ref": {
                        "boxId": "C20",
                        "pinNumber": 1,
                      },
                      "x": -1,
                      "y": 0.1980000000000003,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": -0.2,
                  "pinNumber": 1,
                  "x": -1,
                  "y": -0.0019999999999997242,
                },
                "top0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 2,
                  "x": -1,
                  "y": 1.1990000000000003,
                },
              },
              "pinPositionsAreSet": true,
              "rightPinCount": 0,
              "rightPins": [],
              "topPinCount": 1,
              "topPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 2,
                  "x": -1,
                  "y": 1.1990000000000003,
                },
              ],
              "x": -1,
              "y": 0.6990000000000003,
            },
            ChipBuilder {
              "bottomPinCount": 1,
              "bottomPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 1,
                  "x": 3,
                  "y": 1.4000000000000001,
                },
              ],
              "chipId": "R11",
              "circuit": [Circular],
              "isPassive": true,
              "leftPinCount": 0,
              "leftPins": [],
              "marks": {},
              "pinMap": {
                "bottom0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": null,
                  "lastDx": 0,
                  "lastDy": 0,
                  "pinNumber": 1,
                  "x": 3,
                  "y": 1.4000000000000001,
                },
                "top0": PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 2,
                      },
                      "x": 3,
                      "y": 2.6000000000000005,
                    },
                    "start": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 2,
                      },
                      "x": 3,
                      "y": 2.4000000000000004,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.2,
                  "pinNumber": 2,
                  "x": 3,
                  "y": 2.6000000000000005,
                },
              },
              "pinPositionsAreSet": true,
              "rightPinCount": 0,
              "rightPins": [],
              "topPinCount": 1,
              "topPins": [
                PinBuilder {
                  "chip": [Circular],
                  "lastConnected": null,
                  "lastCreatedLine": {
                    "end": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 2,
                      },
                      "x": 3,
                      "y": 2.6000000000000005,
                    },
                    "start": {
                      "ref": {
                        "boxId": "R11",
                        "pinNumber": 2,
                      },
                      "x": 3,
                      "y": 2.4000000000000004,
                    },
                  },
                  "lastDx": 0,
                  "lastDy": 0.2,
                  "pinNumber": 2,
                  "x": 3,
                  "y": 2.6000000000000005,
                },
              ],
              "x": 3,
              "y": 1.9000000000000001,
            },
          ],
          "connectionPoints": [
            {
              "ref": {
                "boxId": "U3",
                "pinNumber": 6,
              },
              "showAsIntersection": true,
              "x": -1,
              "y": 0.1980000000000003,
            },
            {
              "ref": {
                "boxId": "U3",
                "pinNumber": 8,
              },
              "showAsIntersection": true,
              "x": 4,
              "y": 0.4000000000000001,
            },
          ],
          "defaultChipWidth": 2,
          "defaultPassiveHeight": 0.2,
          "defaultPassiveWidth": 1,
          "defaultPinSpacing": 0.2,
          "defaultSingleSidedChipWidth": 2,
          "lines": [
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": 1.2000000000000002,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 1,
                },
                "x": 0,
                "y": 1.2000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "C20",
                  "pinNumber": 2,
                },
                "x": -1,
                "y": 1.1990000000000003,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": 1.2000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "C20",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": 0.1980000000000003,
              },
              "start": {
                "ref": {
                  "boxId": "C20",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": 0.1990000000000003,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "C20",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": -0.0019999999999997242,
              },
              "start": {
                "ref": {
                  "boxId": "C20",
                  "pinNumber": 1,
                },
                "x": -1,
                "y": 0.1980000000000003,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 6,
                },
                "x": -1,
                "y": 0.20000000000000007,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 6,
                },
                "x": 0,
                "y": 0.20000000000000007,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 6,
                },
                "x": -1,
                "y": 0.1980000000000003,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 6,
                },
                "x": -1,
                "y": 0.20000000000000007,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 4,
                "y": 0.20000000000000007,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 2,
                "y": 0.20000000000000007,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 4,
                "y": 0.4000000000000001,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 4,
                "y": 0.20000000000000007,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 4,
                "y": 2.4,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 7,
                },
                "x": 4,
                "y": 0.4000000000000001,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 8,
                },
                "x": 4,
                "y": 0.4,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 8,
                },
                "x": 2,
                "y": 0.4,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 8,
                },
                "x": 4,
                "y": 0.4000000000000001,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 8,
                },
                "x": 4,
                "y": 0.4,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 9,
                },
                "x": 5,
                "y": 0.6,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 9,
                },
                "x": 2,
                "y": 0.6,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 10,
                },
                "x": 5,
                "y": 0.8000000000000002,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 10,
                },
                "x": 2,
                "y": 0.8000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 11,
                },
                "x": 5,
                "y": 1,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 11,
                },
                "x": 2,
                "y": 1,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 12,
                },
                "x": 3,
                "y": 1.2000000000000002,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 12,
                },
                "x": 2,
                "y": 1.2000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 12,
                },
                "x": 5,
                "y": 1.2000000000000002,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 12,
                },
                "x": 3,
                "y": 1.2000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "R11",
                  "pinNumber": 1,
                },
                "x": 3,
                "y": 1.4000000000000001,
              },
              "start": {
                "ref": {
                  "boxId": "U3",
                  "pinNumber": 12,
                },
                "x": 3,
                "y": 1.2000000000000002,
              },
            },
            {
              "end": {
                "ref": {
                  "boxId": "R11",
                  "pinNumber": 2,
                },
                "x": 3,
                "y": 2.6000000000000005,
              },
              "start": {
                "ref": {
                  "boxId": "R11",
                  "pinNumber": 2,
                },
                "x": 3,
                "y": 2.4000000000000004,
              },
            },
          ],
          "name": "Template 9",
          "netLabels": [
            {
              "anchorSide": "top",
              "fromRef": {
                "boxId": "C20",
                "pinNumber": 1,
              },
              "labelId": "GND",
              "x": -1,
              "y": -0.0019999999999997242,
            },
            {
              "anchorSide": "bottom",
              "fromRef": {
                "boxId": "U3",
                "pinNumber": 7,
              },
              "labelId": "V3_3",
              "x": 4,
              "y": 2.4,
            },
            {
              "anchorSide": "left",
              "fromRef": {
                "boxId": "U3",
                "pinNumber": 9,
              },
              "labelId": "A",
              "x": 5,
              "y": 0.6,
            },
            {
              "anchorSide": "left",
              "fromRef": {
                "boxId": "U3",
                "pinNumber": 10,
              },
              "labelId": "B",
              "x": 5,
              "y": 0.8000000000000002,
            },
            {
              "anchorSide": "left",
              "fromRef": {
                "boxId": "U3",
                "pinNumber": 11,
              },
              "labelId": "C",
              "x": 5,
              "y": 1,
            },
            {
              "anchorSide": "left",
              "fromRef": {
                "boxId": "U3",
                "pinNumber": 12,
              },
              "labelId": "D",
              "x": 5,
              "y": 1.2000000000000002,
            },
            {
              "anchorSide": "bottom",
              "fromRef": {
                "boxId": "R11",
                "pinNumber": 2,
              },
              "labelId": "V3_3",
              "x": 3,
              "y": 2.6000000000000005,
            },
          ],
        },
      },
    ]
  `)
})
