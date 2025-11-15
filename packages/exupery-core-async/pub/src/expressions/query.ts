import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { __create_query_promise } from "../algorithms/query/create_query_promise"


export namespace q {

    export const dictionary = <Result, Error>(
        $: _et.Dictionary<_et.Query_Promise<Result, Error>>,
    ): _et.Query_Promise<_et.Dictionary<Result>, _et.Dictionary<Error>> => {
        return __create_query_promise({
            'execute': (on_success, on_error) => {
                let count_down = $.__get_number_of_entries()
                let has_errors = false

                const errors: { [key: string]: Error } = {}
                const results: { [key: string]: Result } = {}
                const decrement_and_wrap_up_if_done = () => {
                    count_down -= 1
                    if (count_down === 0) {
                        if (has_errors) {
                            on_error(_ei.dictionary_literal(errors))
                        } else {
                            on_success(_ei.dictionary_literal(results))
                        }
                    }
                }
                $.map(($, key) => {
                    $.__start(
                        ($) => {
                            results[key] = $
                            decrement_and_wrap_up_if_done()
                        },
                        ($) => {
                            has_errors = true
                            errors[key] = $
                            decrement_and_wrap_up_if_done()
                        },
                    )
                })
            }
        })
    }

    export const fixed = <Query_Result, Error>(
        query_result: Query_Result,
    ): _et.Query_Promise<Query_Result, Error> => {
        return __create_query_promise({
            'execute': (on_success, on_error) => {
                on_success(query_result)
            }
        })
    }

    export const transform = <In, Out, Error>( //probably better to use the method on the query itself
        query: _et.Query_Promise<In, Error>,
        transform: ($: In) => Out,
    ): _et.Query_Promise<Out, Error> => {
        return __create_query_promise({
            'execute': (on_success, on_error) => {
                query.__start(
                    ($) => {
                        on_success(transform($))
                    },
                    (e) => {
                        on_error(e)
                    }
                )
            }
        })
    }

}