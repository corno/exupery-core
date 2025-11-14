import * as _et from 'exupery-core-types'

import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_unguaranteed_procedure'
import { Basic_Unguaranteed_Query_Promise } from '../types/Basic_Unguaranteed_Query'

export type Conditional_Async_Error<Precondition_Error, Procedure_Error> =
    | ['precondition', Precondition_Error]
    | ['procedure', Procedure_Error]

export const conditional_async = <Precondition_Error, Procedure_Error>(
    precondition: Basic_Unguaranteed_Query_Promise<boolean, Precondition_Error>,
    procedure: _et.Unguaranteed_Procedure_Promise<Procedure_Error>,
): _et.Unguaranteed_Procedure_Promise<Conditional_Async_Error<Precondition_Error, Procedure_Error>> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            precondition.__start(
                ($) => {
                    if ($) {
                        procedure.__start(
                            on_success,
                            (e) => {
                                on_exception(
                                    ['procedure', e]
                                )
                            }
                        )
                    } else {
                        on_success()
                    }
                },
                ($) => {
                    on_exception(['precondition', $])
                }
            )
        }
    })
}
