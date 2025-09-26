import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_program = (
    main: ($: _et.Array<string>) => _easync.Safe_Command_Result
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        () => {
        }
    )
}


/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unsafe_program = (
    main: ($: _et.Array<string>) => _easync.Unsafe_Command_Result<number>
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__start(
        () => {
        },
        ($) => {
            process.exitCode = $
        }
    )
}