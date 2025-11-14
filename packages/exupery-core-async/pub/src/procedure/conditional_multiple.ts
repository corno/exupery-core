import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import  { query_dictionary } from "../query/query_dictionary"

import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'
import { Basic_Query_Promise } from '../types/Basic_Query'

export type Conditional_Multiple_Error <Precondition_Error, Procedure_Error> =
| ['preconditions', _et.Dictionary<Precondition_Error>]
| ['procedure', Procedure_Error]

export const conditional_multiple = <Precondition_Error, Procedure_Error>(
    preconditions: _et.Dictionary<Basic_Query_Promise<boolean, Precondition_Error>>,
    procedure: _et.Procedure_Promise<Procedure_Error>,
): _et.Procedure_Promise<Conditional_Multiple_Error<Precondition_Error, Procedure_Error>> => {
    return __create_procedure_promise({
        'execute': (on_success, on_exception) => {
            query_dictionary(
                preconditions,
            ).__start(
                ($) => {
                    let has_errors = false
                    $.map(($) => {
                        if (!$) {
                            has_errors = true
                        }
                    })
                    if (!has_errors) {
                        // all preconditions passed
                        procedure.__start(
                            on_success,
                            (e) => {
                                on_exception(
                                    ['procedure', e]
                                )
                            }
                        )
                    } else {
                        //the preconditions failed, so we are *successfully* skipping the procedure
                        on_success()
                    }
                },
                ($) => {
                    on_exception(['preconditions', $])
                }
            )
        }
    })
}
