import * as _et from "exupery-core-types"
import { __create_procedure_promise } from "../algorithms/procedure/create_procedure_promise"

export const execute_with_async_data = <Parameters, Error>(
    procedure: _et.Procedure_Primed_With_Resources<Parameters, Error>,
    query: _et.Query_Promise<Parameters, Error>,
): _et.Procedure_Promise<Error> => {
    return __create_procedure_promise({
        'execute': (on_success, on_error) => {
            query.__start(
                (query_result) => {
                    procedure["execute with synchronous data"](query_result).__start(
                        on_success,
                        on_error,
                    )
                },
                on_error,
            )
        }
    })
}