import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

export type Program_Main = ($: _et.Array<string>) => _et.Async_Value<null>
export type Unsafe_Program_Main = ($: _et.Array<string>) => _et.Unsafe_Async_Value<null, number>

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */

export const run_program = (
    main: Program_Main
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        ($) => {
        }
    )
}

export const run_unsafe_program = (
    main: Unsafe_Program_Main
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        ($) => {
        },
        ($) => {
            process.exitCode = $
        }
    )
}