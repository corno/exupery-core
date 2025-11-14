import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

//types

export * from "./types/Basic_Unguaranteed_Query"
export * from "./types/Basic_Guaranteed_Query"

//functions

export * from "./algorithms/query/merge_2_guaranteed_queries"

export * from "./algorithms/query/create_guaranteed_query"
export * from "./algorithms/query/create_unguaranteed_query"
export * from "./algorithms/procedure/initialize_guaranteed_procedure"
export * from "./algorithms/procedure/initialize_unguaranteed_procedure"

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

import { __create_guaranted_procedure } from "./algorithms/procedure/initialize_guaranteed_procedure"
import { __create_unguaranteed_procedure } from "./algorithms/procedure/initialize_unguaranteed_procedure"
import { __create_guaranteed_query } from "./algorithms/query/create_guaranteed_query"
import { __create_unguaranteed_query } from "./algorithms/query/create_unguaranteed_query"




export const query = {
    'guaranteed': {
        'create result': <T>(
            $: T
        ): _et.Guaranteed_Query_Promise<T> => {
            return __create_guaranteed_query(
                {
                    'execute': (on_value) => {
                        on_value($)
                    }
                }
            )
        }
    },
    'unguaranteed': {
        'create result': <T, E>(
            $: T
        ): _et.Unguaranteed_Query_Promise<T, E> => {
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
        ): _et.Unguaranteed_Query_Promise<T, E> => {
            return __create_unguaranteed_query(
                {
                    'execute': (on_value, on_exception) => {
                        on_exception($)
                    }
                }
            )
        }
    },
}