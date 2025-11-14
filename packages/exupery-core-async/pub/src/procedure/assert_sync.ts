import * as _et from 'exupery-core-types'

import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_unguaranteed_procedure'

export type Assert_Sync_Error<Procedure_Error> =
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export const assert_sync = <Assertion_Error, Procedure_Error>(
    assertion: boolean,
    procedure: _et.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _et.Unguaranteed_Procedure_Promise<Assert_Sync_Error<Procedure_Error>> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            if (!assertion) {
                on_exception(['assertion failed', null])
                return
            }
            procedure.__start(
                on_success,
                ($) => {
                    on_exception(['procedure error', $])
                }
            )
        }
    })
}