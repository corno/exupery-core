import * as _et from 'exupery-core-types'

import { __create_resource_command } from './create_resource_command'
import { __create_command_promise } from './create_command_promise'

export const create_command_procedure = <Error, Parameters, Command_Resources, Query_Resources>(
    execution_handler: (
        $p: Parameters,
        $qr: Query_Resources,
        $cr: Command_Resources,
    ) => _et.Command_Promise<Error>,
): _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources> => {
    return ($qr, $cr) => {
        return {
            'execute': (parameters, transform_error) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {
                        execution_handler(parameters, $qr, $cr).__start(
                            on_success,
                            ($) => {
                                on_error(
                                    transform_error($)
                                )
                            }
                        )
                    }
                })
            },
        }
    }
}