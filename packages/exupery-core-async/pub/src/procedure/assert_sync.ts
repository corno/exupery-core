import * as _et from 'exupery-core-types'

import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'

export type Assert_Sync_Error<Procedure_Error> =
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export const assert_sync = <Assertion_Error, Procedure_Error>(
    assertion: boolean,
    procedure: _et.Procedure_Promise<Procedure_Error>,
): _et.Procedure_Promise<Assert_Sync_Error<Procedure_Error>> => {
    return __create_procedure_promise({
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