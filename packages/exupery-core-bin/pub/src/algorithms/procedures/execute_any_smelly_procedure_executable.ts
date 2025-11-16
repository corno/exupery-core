import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_smelly_procedure_executable/data_types/target"

import { spawn } from "node:child_process"

// import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/execute_smelly_procedure_executable"


/**
 * 
 * The executable being executed is assumed to only cause side effects
 * and not return any meaningful data, std::out is therefor ignored
 */
export const $$: _et.Command<d.Parameters, d.Error> = _easync.__create_procedure_primed_with_resources( (
    $p,
) => {
    const args = $p.args.__get_raw_copy()
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {

            const child = spawn($p.program, args, {
                shell: false, // ✅ direct execution, no shell
            })

            let stderrData = ""

            let stdoutData = ""

            child.stdout.on("data", chunk => {
                stdoutData += chunk.toString("utf8")
            })

            child.stderr.on("data", chunk => {
                stderrData += chunk.toString("utf8")
            })

            child.on("error", err => {
                on_error(_ei.block((): d.Error => {
                    return ['failed to spawn', { message: err instanceof Error ? err.message : `${err}` }]
                }))
            })

            child.on("close", exitCode => {
                //what does an exit code of null even mean?
                
                if (exitCode === 0) {
                    on_success()
                } else {
                    on_error(_ei.block((): d.Error => {
                        return ['non zero exit code', {
                             'exit code': exitCode === null ? _ei.not_set() : _ei.set(exitCode),
                            'stderr': stderrData,
                            'stdout': stdoutData,
                        }]
                    }))
                }
            })
        }
    })
})