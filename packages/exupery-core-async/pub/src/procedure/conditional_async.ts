import * as _et from 'exupery-core-types'

import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'
import { Basic_Query_Promise } from '../types/Basic_Query'

export type Conditional_Async_Error<Precondition_Error, Procedure_Error> =
    | ['precondition', Precondition_Error]
    | ['procedure', Procedure_Error]

export const conditional_async = <Precondition_Error, Procedure_Error>(
    precondition: Basic_Query_Promise<boolean, Precondition_Error>,
    procedure: _et.Procedure_Promise<Procedure_Error>,
): _et.Procedure_Promise<Conditional_Async_Error<Precondition_Error, Procedure_Error>> => {
    return __create_procedure_promise({
        'execute': (on_success, on_error) => {
            precondition.__start(
                ($) => {
                    if ($) {
                        procedure.__start(
                            on_success,
                            (e) => {
                                on_error(
                                    ['procedure', e]
                                )
                            }
                        )
                    } else {
                        on_success()
                    }
                },
                ($) => {
                    on_error(['precondition', $])
                }
            )
        }
    })
}
