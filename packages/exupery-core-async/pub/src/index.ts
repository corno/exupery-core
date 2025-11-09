import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

//types

export * from "./types/Guaranteed_Procedure"
export * from "./types/Unguaranteed_Procedure"
export * from "./types/Unguaranteed_Query"
export * from "./types/Guaranteed_Query"

//functions

export * from "./algorithms/query/merge_2_guaranteed_queries"

export * from "./algorithms/query/create_guaranteed_query"
export * from "./algorithms/query/create_unguaranteed_query"
export * from "./algorithms/procedure/initialize_guaranteed_procedure"
export * from "./algorithms/procedure/initialize_unguaranteed_procedure"

export * from "./shorthands"


import { Guaranteed_Query_Promise } from "./types/Guaranteed_Query"
import { Unguaranteed_Query_Promise } from "./types/Unguaranteed_Query"

import { __create_guaranted_procedure } from "./algorithms/procedure/initialize_guaranteed_procedure"
import { __create_unguaranteed_procedure } from "./algorithms/procedure/initialize_unguaranteed_procedure"
import { __create_guaranteed_query } from "./algorithms/query/create_guaranteed_query"
import { __create_unguaranteed_query } from "./algorithms/query/create_unguaranteed_query"


export const query = {
    'guaranteed': {
        'create result': <T>(
            $: T
        ): Guaranteed_Query_Promise<T> => {
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
        ): Unguaranteed_Query_Promise<T, E> => {
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
        ): Unguaranteed_Query_Promise<T, E> => {
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