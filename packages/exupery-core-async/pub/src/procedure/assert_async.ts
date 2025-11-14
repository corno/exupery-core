import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_procedure'

export type Assert_Async_Error<Assertion_Error, Procedure_Error> =
    | ['assertion error', Assertion_Error]
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export const assert_async = <Assertion_Error, Procedure_Error>(
    assertion: _et.Query_Promise<boolean, Assertion_Error>,
    procedure: _et.Procedure_Promise<Procedure_Error>,
): _et.Procedure_Promise<Assert_Async_Error<Assertion_Error, Procedure_Error>> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            assertion.__start(
                ($) => {
                    if ($) {
                        procedure.__start(
                            on_success,
                            ($) => {
                                on_exception(['procedure error', $])
                            }
                        )
                    } else {
                        on_exception(['assertion failed', null])
                    }
                },
                ($) => {
                    on_exception(['assertion error', $])
                }
            )
        }
    })
}
