import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

export const run_program = (
    main: ($: _et.Array<string>) => _et.Async_Value<number>
): void => {
    main(_ei.array_literal(process.argv.slice(2))).__execute(($) => {
        process.exitCode = $
    })
}