import * as _et from 'exupery-core-types'
import { __create_procedure_promise } from './create_procedure_promise'

export const __create_procedure_primed_with_resources = <Parameters, Error, Resources>(
    handler: ($: Parameters) => _et.Procedure_Promise<Error>,
): _et.Procedure_Primed_With_Resources<Parameters, Error> => {
    return {
        'execute with synchronous data': handler,

        'execute with synchronous data and map error': (parameters, map_error) => {
            return __create_procedure_promise({
                'execute': (on_success, on_error) => {
                    handler(parameters).__start(
                        on_success,
                        (error) => {
                            on_error(
                                map_error(error)
                            )
                        }
                    )
                }
            })
        },

        'execute with asynchronous data': (query) => {
            return __create_procedure_promise({
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

        'execute with asynchronous data and map error': (query, map_error) => {
            return __create_procedure_promise({
                'execute': (on_success, on_error) => {
                    query.__start(
                        ($) => {
                            handler($).__start(
                                on_success,
                                (error) => {
                                    on_error(
                                        map_error(error)
                                    )
                                }
                            )
                        },
                        (error) => {
                            on_error(
                                map_error(error)
                            )
                        },
                    )
                }
            })
        }
    }
}