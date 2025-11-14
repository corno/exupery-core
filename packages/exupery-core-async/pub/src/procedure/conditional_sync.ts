import * as _et from 'exupery-core-types'
import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_unguaranteed_procedure'

export const conditional_sync = <Procedure_Error>(
    precondition: boolean,
    procedure: _et.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _et.Unguaranteed_Procedure_Promise<Procedure_Error> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            if (precondition) {
                procedure.__start(
                    on_success,
                    on_exception
                )
            } else {
                on_success()
            }
        }
    })
}
