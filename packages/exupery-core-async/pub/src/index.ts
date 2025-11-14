import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

//types

export * from "./types/Basic_Query"

//functions

export * from "./algorithms/query/create_query"
export * from "./algorithms/procedure/initialize_procedure"

export * from "./shorthands"

// procedure exports
export * from "./procedure/assert_async"
export * from "./procedure/assert_sync"
export * from "./procedure/conditional_async"
export * from "./procedure/conditional_multiple"
export * from "./procedure/conditional_sync"
export * from "./procedure/sequence"
export * from "./procedure/three_steps"
export * from "./procedure/two_steps"
export * from "./procedure/unguaranteed_procedure_dictionary"

// query exports
export * from "./query/transform_query"
export * from "./query/unguaranteed_query_dictionary"

import { __create_unguaranteed_procedure } from "./algorithms/procedure/initialize_procedure"
import { __create_unguaranteed_query } from "./algorithms/query/create_query"




export const query = {
    'create result': <T, E>(
        $: T
    ): _et.Query_Promise<T, E> => {
        return __create_unguaranteed_query(
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
        return __create_unguaranteed_query(
            {
                'execute': (on_value, on_exception) => {
                    on_exception($)
                }
            }
        )
    }
}