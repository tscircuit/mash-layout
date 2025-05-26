import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import { PipelineDebuggerSidebar } from "./PipelineDebuggerSidebar"

/**
 * This component debugs the Schematic Layout Pipeline.
 *
 * You can inspect each stage of the pipeline, and even sub-stages within each
 * stage. Even individual steps!
 *
 */
export const PipelineDebugger = (props: {
  solver: SchematicLayoutPipelineSolver
}) => {
  return (
    <div>
      <PipelineDebuggerSidebar solver={props.solver} />
    </div>
  )
}
