import * as _et from 'exupery-core-types'
import { __create_command_promise } from './create_command_promise'

export type Basic_Procedure_Primed_With_Resources<Parameters, Error> = ($: Parameters) => _et.Command_Promise<Error>

export const __create_procedure_primed_with_resources = <Parameters, Error, Resources>(
    handler: Basic_Procedure_Primed_With_Resources<Parameters, Error>,
): _et.Command<Parameters, Error> => {
    return {
        'execute with synchronous data without error transformation': handler,

        'execute with synchronous data': (parameters, transform_error) => {
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

        'execute with asynchronous data without error transformation': (query) => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    query.__start(
                        ($) => {
                            handler($).__start(
                                on_success,
                                on_error,
                            )
                        },
                        on_error,
                    )
                }
            })
        },

        'execute with asynchronous data': (query, transform_error) => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    query.__start(
                        ($) => {
                            handler($).__start(
                                on_success,
                                (error) => {
                                    on_error(
                                        transform_error(error)
                                    )
                                }
                            )
                        },
                        (error) => {
                            on_error(
                                transform_error(error)
                            )
                        },
                    )
                }
            })
        }
    }
}