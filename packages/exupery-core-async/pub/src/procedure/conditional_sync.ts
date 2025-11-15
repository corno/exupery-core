import * as _et from 'exupery-core-types'
import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'

export const conditional_sync = <Procedure_Error>(
    precondition: boolean,
    procedure: _et.Procedure_Promise<Procedure_Error>,
): _et.Procedure_Promise<Procedure_Error> => {
    return __create_procedure_promise({
        'execute': (on_success, on_error) => {
            if (precondition) {
                procedure.__start(
                    on_success,
                    on_error
                )
            } else {
                on_success()
            }
        }
    })
}
