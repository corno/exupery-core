import * as _et from 'exupery-core-types'
import { __create_query_promise } from './create_query_promise'

export const __create_query = <Parameters, Result, Error, Resources>(
    handler: ($: Parameters) => _et.Query_Promise<Result, Error>,
): _et.Query<Parameters, Result, Error> => {
    return {
        'execute': (parameters) => {
            return __create_query_promise({
                'execute': (on_success, on_error) => {
                    handler(parameters).__start(
                        on_success,
                        on_error,
                    )
                }
            })
        }
    }
}