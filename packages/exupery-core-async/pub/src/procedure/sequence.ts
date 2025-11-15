import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'


export const sequence = <Error>(
    steps: _et.Array<_et.Procedure_Promise<Error>>,
): _et.Procedure_Promise<Error> => {
    return __create_procedure_promise({
        'execute': (on_success, on_error) => {

            let current = 0

            const do_next = () => {
                steps.__get_element_at(current).transform(
                    ($) => {
                        current += 1
                        $.__start(
                            () => {
                                do_next()
                            },
                            on_error
                        )
                    },
                    () => {
                        on_success()
                    }
                )
            }
            do_next()
        }
    })
}