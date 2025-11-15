import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

//types

export * from "./types/Basic_Query"

//functions

export * from "./algorithms/query/create_query_promise"
export * from "./algorithms/procedure/create_procedure"
export * from "./algorithms/procedure/create_procedure_promise"
export * from "./algorithms/procedure/create_procedure_primed_with_resources"

export * from "./shorthands"

// procedure exports
export * from "./procedure/assert_async"
export * from "./procedure/assert_sync"
export * from "./procedure/execute_with_async_data"
export * from "./procedure/conditional_async"
export * from "./procedure/conditional_multiple"
export * from "./procedure/conditional_sync"
export * from "./procedure/dictionary_sequence"
export * from "./procedure/sequence"
export * from "./procedure/three_steps"
export * from "./procedure/two_steps"
export * from "./procedure/procedure_dictionary"

// query exports
export * from "./query/transform_query"
export * from "./query/query_dictionary"

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
    'raise exception': <T, E>(
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