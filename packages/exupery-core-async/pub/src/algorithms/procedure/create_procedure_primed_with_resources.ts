import * as _et from 'exupery-core-types'
import { __create_procedure_promise } from './create_procedure_promise'

export const create_procedure_primed_with_resources_a = <Parameters, Error, Resources>(
    handler: ($: Parameters) => _et.Procedure_Promise<Error>,
): _et.Procedure_Primed_With_Resources<Parameters, Error> => {
    return {
        'execute with synchrounous data': handler,
        'execute with asynchrounous data': (query) => {
            return __create_procedure_promise({
                'execute': (on_success, on_exception) => {
                    query.__start(
                        ($) => {
                            handler($).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        on_exception,
                    )
                }
            })
        }
    }
}

export const create_procedure_primed_with_resources_b = <Parameters, Error, Resources>(
    handler: ($: Parameters) => _et.Procedure_Promise<Error>,
): _et.Procedure_Primed_With_Resources<Parameters, Error> => {
    return {
        'execute with synchrounous data': handler,
        'execute with asynchrounous data': (query) => {
            return __create_procedure_promise({
                'execute': (on_success, on_exception) => {
                    query.__start(
                        ($) => {
                            handler($).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        on_exception,
                    )
                }
            })
        }
    }
}