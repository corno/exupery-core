import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


export type Run_Safe_Program_Main = (
    $: {
        'arguments': _et.Array<string>,
    },
    init: _easync.Safe_Command_Result
) => _easync.Safe_Command_Result

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_program = (
    main: Run_Safe_Program_Main
): void => {
    main(
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
        _easync.initialize_safe_command()
    ).__start(
        () => {
        }
    )
}

export type Error = {
    'exit code': number
}

export type Run_Unsafe_Program_Main = (
    $: {
        'arguments': _et.Array<string>
    },
    init: _easync.Unsafe_Command_Result<Error>
) => _easync.Unsafe_Command_Result<Error>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unsafe_program = (
    main: Run_Unsafe_Program_Main
): void => {
    main(
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
        _easync.initialize_unsafe_command()
    ).__start(
        () => {
        },
        ($) => {
            process.exitCode = $['exit code']
        }
    )
}