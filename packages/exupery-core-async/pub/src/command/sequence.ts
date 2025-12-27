import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import { __create_command_promise } from './creaters/create_command_promise'
import { Command_Block } from './Command_Block'

export const __sequence = <Error>(
    block: Command_Block<Error>,
): _et.Command_Promise<Error> => {
    return __create_command_promise({
        'execute': (
            on_success,
            on_error,
        ) => {

            const length = _ei.list_literal(block).get_number_of_elements()
            const runStep = (index: number) => {
                if (index >= length) {
                    on_success()
                    return
                }
                block[index].__start(
                    () => runStep(index + 1),
                    on_error,
                )
            }
            runStep(0)
        }
    })
}