import * as _et from 'exupery-core-types'
import { Basic_Query_Promise } from '../types/Basic_Query'
import { __create_query_promise } from '../algorithms/query/create_query_promise'

export const transform_query = <In, Out, Error>(
    query: Basic_Query_Promise<In, Error>,
    transform: ($: In) => Out,
): _et.Query_Promise<Out, Error> => {
    return __create_query_promise({
        'execute': (on_success, on_exception) => {
            query.__start(
                ($) => {
                    on_success(transform($))
                },
                (e) => {
                    on_exception(e)
                }
            )
        }
    })
}
