import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

//types

//functions

export * from "./algorithms/query/create_query_promise"
export * from "./algorithms/query/create_query_primed_with_resources"
export * from "./algorithms/query/create_query"

export * from "./algorithms/procedure/create_procedure"
export * from "./algorithms/procedure/create_procedure_promise"
export * from "./algorithms/procedure/create_procedure_primed_with_resources"

// procedure exports
export * from "./expressions/procedure"

// query exports
export * from "./expressions/query"

import { __create_procedure_promise } from "./algorithms/procedure/create_procedure_promise"
import { __create_query_promise } from "./algorithms/query/create_query_promise"




export const query = {
    'create result': <T, E>(
        $: T
    ): _et.Query_Promise<T, E> => {
        return __create_query_promise(
            {
                'execute': (on_value) => {
                    on_value($)
                }
            }
        )
    },
    'raise error': <T, E>(
        $: E
    ): _et.Query_Promise<T, E> => {
        return __create_query_promise(
            {
                'execute': (on_value, on_error) => {
                    on_error($)
                }
            }
        )
    }
}