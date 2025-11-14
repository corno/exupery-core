import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_unguaranteed_procedure'

export const unguaranteed_procedure_dictionary = <Error>(
    $: _et.Dictionary<_et.Unguaranteed_Procedure_Promise<Error>>,
): _et.Unguaranteed_Procedure_Promise<_et.Dictionary<Error>> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            let count_down = $.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_exception(_ei.dictionary_literal(errors))
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