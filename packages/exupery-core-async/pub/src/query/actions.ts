import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { __create_query_promise } from "./creaters/create_query_promise"


export namespace q {

    export const dictionary_parallel = <Result, Error, Entry_Error>(
        dictionary: _et.Dictionary<_et.Query_Promise<Result, Entry_Error>>,
        aggregate_errors: _et.Transformer_Without_Parameters<_et.Dictionary<Entry_Error>, Error>,

    ): _et.Query_Promise<_et.Dictionary<Result>, Error> => {
        return __create_query_promise({
            'execute': (on_success, on_error) => {
                let count_down = dictionary.__get_number_of_entries()
                let has_errors = false

                const errors: { [key: string]: Entry_Error } = {}
                const results: { [key: string]: Result } = {}
                const decrement_and_wrap_up_if_done = () => {
                    count_down -= 1
                    if (count_down === 0) {
                        if (has_errors) {
                            on_error(aggregate_errors(_ei.dictionary_literal(errors)))
                        } else {
                            on_success(_ei.dictionary_literal(results))
                        }
                    }
                }
                dictionary.map(($, key) => {
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

    export const dictionary_parallel_without_error_aggregation = <Result, Error>(
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

    export const fixed = <Result, Error>(
        result: Result,
    ): _et.Query_Promise<Result, Error> => {
        return __create_query_promise({
            'execute': (on_success, on_error) => {
                on_success(result)
            }
        })
    }

    export const raise_error = <T, E>(
        $: E
    ): _et.Query_Promise<T, E> => {
        return __create_query_promise(
            {
                'execute': (on_value, on_error) => {
                    on_error($)
                }
            }
        )
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