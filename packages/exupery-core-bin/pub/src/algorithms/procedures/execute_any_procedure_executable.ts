import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_procedure_executable/data_types/target"

import { spawn } from "node:child_process"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/unguaranteed/execute_procedure_executable"


/**
 * 
 * The executable being executed is assumed to only cause side effects
 * and not return any meaningful data, std::out is therefor ignored
 */
export const $$: _et.Procedure_Primed_With_Resources<d.Parameters, d.Error> = (
    $p,
) => {
    const args = $p.args.__get_raw_copy()
    return _easync.__create_procedure({
        'execute': (on_success, on_exception) => {

            const child = spawn($p.program, args, {
                shell: false, // ✅ direct execution, no shell
            })

            let stderrData = ""

            child.stderr.on("data", chunk => {
                stderrData += chunk.toString("utf8")
            })

            child.on("error", err => {
                on_exception(_ei.block((): d.Error => {
                    return ['failed to spawn', { message: err instanceof Error ? err.message : `${err}` }]
                }))
            })

            child.on("close", exitCode => {
                if (exitCode === 0) {
                    on_success()
                } else {
                    on_exception(_ei.block((): d.Error => {
                        return ['non zero exit code', {
                            'exit code': exitCode === null ? _ei.not_set() : _ei.set(exitCode),
                            'stderr': stderrData
                        }]
                    }))
                }
            })
        }
    })
}
