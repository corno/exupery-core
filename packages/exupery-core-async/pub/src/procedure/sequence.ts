import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import { __create_procedure } from '../algorithms/procedure/initialize_procedure'


export const sequence = <Error>(
    steps: _et.Array<_et.Procedure_Promise<Error>>,
): _et.Procedure_Promise<Error> => {
    return __create_procedure({
        'execute': (on_success, on_exception) => {

            let current = 0

            const do_next = () => {
                steps.__get_element_at(current).transform(
                    ($) => {
                        current += 1
                        $.__start(
                            () => {
                                do_next()
                            },
                            on_exception
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