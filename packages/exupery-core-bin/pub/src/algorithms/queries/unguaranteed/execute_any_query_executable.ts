import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_query_executable/data_types/target"


import { spawn } from "node:child_process"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/unguaranteed/execute_query_executable"


/**
 * 
 * The executable being executed is assumed to be side effect free
 * There is no way to give guarantees about that though
 */
export const $$: _et.Query_Primed_With_Resources<d.Parameters, d.Result, d.Error> = (
    $p
) => {
    const args = $p.args.__get_raw_copy()
    return _easync.__create_query({
        'execute': (on_value, on_exception) => {

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
                on_exception(_ei.block((): d.Error => {
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
                    on_exception(_ei.block((): d.Error => {
                        return ['non zero exit code', {
                            'exit code': exitCode === null ? _ei.not_set() : _ei.set(exitCode),
                            'stderr': stderrData,
                        }]
                    }))
                }
            })
        }
    })
}
