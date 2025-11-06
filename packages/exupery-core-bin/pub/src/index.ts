import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'



export type Parameters = {
    'arguments': _et.Array<string>,
}

export type Error = {
    'exit code': number
}

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_guaranteed_main_procedure = (
    main: _easync.Guaranteed_Procedure_Initializer<Parameters>
): void => {
    main({
        'arguments': _ei.array_literal(process.argv.slice(2))
    }).__start(
        () => { }
    )
}
/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unguaranteed_main_procedure = (
    main: _easync.Unguaranteed_Procedure_Initializer<Parameters, Error>
): void => {
    main({
        'arguments': _ei.array_literal(process.argv.slice(2))
    }).__start(
        () => {
        },
        ($) => {
            process.exitCode = $['exit code']
        }
    )
}