import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { __create_resource_command } from './create_resource_command'
import { __create_command_promise } from './create_command_promise'
import { __sequence } from '../sequence'
import { Command_Block } from '../Command_Block'

export const create_command_procedure = <Error, Parameters, Command_Resources, Query_Resources>(
    execution_handler: (
        $p: Parameters,
        $cr: Command_Resources,
        $qr: Query_Resources,
    ) => Command_Block<Error>,
): _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources> => {
    return ($cr, $qr) => {
        return {
            'execute': (parameters, error_transformer) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {

                        __sequence(execution_handler(parameters, $cr, $qr)).__start(
                            on_success,
                            ($) => {
                                on_error(
                                    error_transformer($)
                                )
                            }
                        )
                    }
                })
            },
        }
    }
}