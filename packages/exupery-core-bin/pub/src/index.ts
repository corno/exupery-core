import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


export type Guaranteed_Main_Initializer = _easync.Initialize_Guaranteed_Procedure<Parameters>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_guaranteed_main_procedure = (
    main: Guaranteed_Main_Initializer
): void => {
    main({
        'arguments': _ei.array_literal(process.argv.slice(2))
    }).__start(
        () => { }
    )
}

export type Parameters = {
    'arguments': _et.Array<string>,
}

export type Error = {
    'exit code': number
}

export type Unguaranteed_Main_Initializer = _easync.Initialize_Unguaranteed_Procedure<Parameters, Error>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unguaranteed_main_procedure = (
    main: Unguaranteed_Main_Initializer
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