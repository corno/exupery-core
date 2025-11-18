import * as _et from 'exupery-core-types'
import { __create_command_promise } from './create_command_promise'

export type Basic_Command<Parameters, Error> = ($: Parameters) => _et.Command_Promise<Error>

export const __create_resource_command = <Parameters, Error, Query_Resources, Command_Resources>(
    handler: Basic_Command<Parameters, Error>,
): _et.Command<Parameters, Error> => {
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