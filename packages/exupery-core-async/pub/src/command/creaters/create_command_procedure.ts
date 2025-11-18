import * as _et from 'exupery-core-types'

import { __create_resource_command } from './create_resource_command'
import { __create_command_promise } from './create_command_promise'

export const create_command_procedure = <Error, Parameters, Variables, Command_Resources, Query_Resources>(
    variables_handler: (
        $q: Query_Resources,
        $p: Parameters,
    ) => _et.Data_Preparation_Result<Variables, Error>,
    execution_handler: (
        $c: Command_Resources,
        $p: Parameters,
        $v: Variables,
    ) => _et.Command_Promise<Error>,
): _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources> => {
    return ($q, $c) => {
        return {

            'execute': (parameters, transform_error) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {
                        variables_handler($q, parameters).__extract_data(
                            ($) => {
                                execution_handler($c, parameters, $).__start(
                                    on_success,
                                    ($) => {
                                        on_error(
                                            transform_error($)
                                        )
                                    }
                                )
                            },
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