import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import { Basic_Query_Promise } from '../types/Basic_Query'
import { __create_query } from '../algorithms/query/create_query'

export const query_dictionary = <Result, Error>(
    $: _et.Dictionary<Basic_Query_Promise<Result, Error>>,
): _et.Query_Promise<_et.Dictionary<Result>, _et.Dictionary<Error>> => {
    return __create_query({
        'execute': (on_success, on_exception) => {
            let count_down = $.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const results: { [key: string]: Result } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_exception(_ei.dictionary_literal(errors))
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