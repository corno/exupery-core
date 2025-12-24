import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_query_executable/data_types/target"

//dependencies
import { spawn } from "node:child_process"


/**
 * 
 * The executable being executed is assumed to be side effect free
 * There is no way to give guarantees about that though
 */
export const $$: resources.queries.execute_any_query_executable = _easync.__create_query(
    ($p,) => {
        const args = $p.args.__get_raw_copy()
        return _ei.__create_query_result((on_value, on_error) => {

            const child = spawn($p.program, args, {
                shell: false, // ✅ no implicit parsing
            })

            let stdoutData = ""
            let stderrData = ""

            child.stdout.on("data", chunk => {
                stdoutData += chunk.toString("utf8")
            })

            child.stderr.on("data", chunk => {
                stderrData += chunk.toString("utf8")
            })

            child.on("error", err => {
                on_error(_ei.block((): d.Error => {
                    return ['failed to spawn', {
                        message: err instanceof Error ? err.message : `${err}`
                    }]
                }))
            })

            child.on("close", exitCode => {
                if (exitCode === 0) {
                    on_value({
                        stdout: stdoutData,
                    })
                } else {
                    on_error(_ei.block((): d.Error => {
                        return ['non zero exit code', {
                            'exit code': exitCode === null ? _ei.not_set() : _ei.set(exitCode),
                            'stderr': stderrData,
                        }]
                    }))
                }
            })
        })
    }
)