import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

export type Program_Main = ($: _et.Array<string>) => _easync.Safe_Command_Result
export type Unsafe_Program_Main = ($: _et.Array<string>) => _easync.Unsafe_Command_Result<number>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */

export const run_program = (
    main: Program_Main
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        () => {
        }
    )
}

export const run_unsafe_program = (
    main: Unsafe_Program_Main
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        () => {
        },
        ($) => {
            process.exitCode = $
        }
    )
}