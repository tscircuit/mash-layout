import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import React from "react"
import { PipelineDebugger } from "website/components/PipelineDebugger"

export default () => (
  <PipelineDebugger
    solver={
      new SchematicLayoutPipelineSolver({
        // TODO let's make the pipeline debugger accept tscircuit code
        inputNetlist,
      })
    }
  />
)
