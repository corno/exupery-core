import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'

export const procedure_dictionary = <Error>(
    $: _et.Dictionary<_et.Procedure_Promise<Error>>,
): _et.Procedure_Promise<_et.Dictionary<Error>> => {
    return __create_procedure_promise({
        'execute': (on_success, on_error) => {
            let count_down = $.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_error(_ei.dictionary_literal(errors))
                    } else {
                        on_success()
                    }
                }
            }
            $.map(($, key) => {
                $.__start(
                    () => {
                        decrement_and_wrap_up_if_done()
                    },
                    (e) => {
                        has_errors = true
                        errors[key] = e
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        }
    })
}