import * as _et from 'exupery-core-types'
import { __create_command_promise } from './create_command_promise'

export const __create_resource_command = <Error, Parameters, Query_Resources, Command_Resources>(
    handler: ($: Parameters) => _et.Command_Promise<Error>,
): _et.Command<Error, Parameters> => {
    return {

        'execute': (parameters, transform_error) => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    handler(parameters).__start(
                        on_success,
                        (error) => {
                            on_error(
                                transform_error(error)
                            )
                        }
                    )
                }
            })
        },
    }
}