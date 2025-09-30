import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


export type Run_Safe_Program_Main = (
    $i: _easync.Guaranteed_Procedure_Context,
    $: {
        'arguments': _et.Array<string>,
    },
) => _easync.Guaranteed_Procedure_Context

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_program = (
    main: Run_Safe_Program_Main
): void => {
    main(
        _easync.initialize_guaranteed_procedure_context(),
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
    ).__start(
        () => {
        }
    )
}

export type Error = {
    'exit code': number
}

export type Run_Unguaranteed_Program_Main = (
    $i: _easync.Ungaranteed_Procedure_Context<Error>,
    $: {
        'arguments': _et.Array<string>
    },
) => _easync.Ungaranteed_Procedure_Context<Error>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unsafe_program = (
    main: Run_Unguaranteed_Program_Main
): void => {
    main(
        _easync.initialize_unguaranteed_procedure_context(),
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
    ).__start(
        () => {
        },
        ($) => {
            process.exitCode = $['exit code']
        }
    )
}