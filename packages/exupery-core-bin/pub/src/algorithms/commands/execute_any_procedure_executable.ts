import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d_eace from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_procedure_executable/data_types/target"

//dependencies
import { spawn } from "node:child_process"

/**
 * 
 * The executable being executed is assumed to only cause side effects
 * and not return any meaningful data, std::out is therefor ignored
 */
export const $$: resources.commands.execute_any_command_executable = _easync.__create_resource_command( (
    $p,
) => {
    const args = $p.args.__get_raw_copy()
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {

            const child = spawn($p.program, args, {
                shell: false, // ✅ direct execution, no shell
            })

            let stderrData = ""

            child.stderr.on("data", chunk => {
                stderrData += chunk.toString("utf8")
            })

            child.on("error", err => {
                on_error(_ei.block((): d_eace.Error => {
                    return ['failed to spawn', { message: err instanceof Error ? err.message : `${err}` }]
                }))
            })

            child.on("close", exitCode => {
                if (exitCode === 0) {
                    on_success()
                } else {
                    on_error(_ei.block((): d_eace.Error => {
                        return ['non zero exit code', {
                            'exit code': exitCode === null ? _ei.not_set() : _ei.set(exitCode),
                            'stderr': stderrData
                        }]
                    }))
                }
            })
        }
    })
})