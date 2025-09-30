import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

export * from "./Guaranteed_Procedure_Context"
export * from "./Unguaranteed_Procedure_Context"
export * from "./Guaranteed_Query_Result"
export * from "./Unguaranteed_Query_Result"

export * from "./merge_2_guaranteed_query_results"

export * from "./run_guaranteed_query"
export * from "./run_unguaranteed_query"
export * from "./initialize_guaranteed_procedure_context"
export * from "./initialize_unguaranteed_procedure_context"


import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Ungaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"
import { Unguaranteed_Query_Result } from "./Unguaranteed_Query_Result"

import { __execute_guaranteed_action, initialize_guaranteed_procedure_context } from "./initialize_guaranteed_procedure_context"
import { __execute_unguaranteed_action, initialize_unguaranteed_procedure_context } from "./initialize_unguaranteed_procedure_context"
import { __run_guaranteed_query } from "./run_guaranteed_query"
import { __run_unguaranteed_query } from "./run_unguaranteed_query"


export const query = {
    'guaranteed': {
        'create result': <T>(
            $: T
        ): Guaranteed_Query_Result<T> => {
            return __run_guaranteed_query(
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
        ): Unguaranteed_Query_Result<T, E> => {
            return __run_unguaranteed_query(
                {
                    'execute': (on_value) => {
                        on_value($)
                    }
                }
            )
        },
        'raise exception': <T, E>(
            $: E
        ): Unguaranteed_Query_Result<T, E> => {
            return __run_unguaranteed_query(
                {
                    'execute': (on_value, on_exception) => {
                        on_exception($)
                    }
                }
            )
        }
    },
}

export const command = {
    'guaranteed': {
        'initialize': initialize_guaranteed_procedure_context
    },
    'unguaranteed': {
        'initialize': initialize_unguaranteed_procedure_context,
        'raise exception': <E>(
            $: E
        ): Ungaranteed_Procedure_Context<E> => {
            return __execute_unguaranteed_action(
                {
                    'execute': (on_success, on_exception) => {
                        on_exception($)
                    }
                }
            )
        },

    },
}


// //array
//     map_async<NT>(
//         handle_value: ($: T) => Safe_Query_Result<NT>
//     ): Safe_Query_Result<Array<NT>>
//     map_async_unsafe<NT, NE>(
//         handle_value: ($: T) => Unsafe_Query_Result<NT, NE>
//     ): Unsafe_Query_Result<Array<NT>, Array<NE>>

// //dictionary



//     /**
//      * 
//      * @param handle_value callback that provides an {@link Safe_Query_Result}. keys are not available.
//      */
//     query_safe_with_entries<NT>(
//         handle_value: ($: T) => Safe_Query_Result<NT>
//     ): Safe_Query_Result<Dictionary<NT>>

//     query_unsafe_with_entries<NT, NE>(
//         handle_value: ($: T) => Unsafe_Query_Result<NT, NE>,
//     ): Unsafe_Query_Result<Dictionary<NT>, Dictionary<NE>>



//     map_async<NT>(on_entry_value: ($: T) => _et.Async_Value<NT>): _et.Async_Value<_et.Dictionary<NT>> {
//         const source = this.source
//         const temp: { [key: string]: NT } = {}
//         return create_Async_Value(
//             {
//                 'execute': (on_dictionary_value) => {
//                     create_asynchronous_processes_monitor(
//                         (counter) => {
//                             source.map(($) => {
//                                 counter['report process started']()
//                                 on_entry_value($.value).__start((nv) => {
//                                     temp[$.key] = nv
//                                     counter['report process finished']()
//                                 })
//                             })
//                         },
//                         () => {
//                             on_dictionary_value(dictionary_literal(temp))
//                         }
//                     )
//                 }
//             }
//         )
//     }
//     map_async_unsafe<NT, NE>(on_entry_value: ($: T) => _et.Unsafe_Async_Value<NT, NE>): _et.Unsafe_Async_Value<_et.Dictionary<NT>, _et.Dictionary<NE>> {
//         const source = this.source
//         const temp_values: { [key: string]: NT } = {}
//         const temp_exceptions: { [key: string]: NE } = {}
//         return create_Unsafe_Async_Value(
//             {
//                 'execute': (
//                     on_dictionary_value,
//                     on_dictionary_exception,
//                 ) => {
//                     create_asynchronous_processes_monitor(
//                         (counter) => {
//                             source.map(($) => {
//                                 counter['report process started']()
//                                 on_entry_value($.value).__start(
//                                     (value) => {
//                                         temp_values[$.key] = value
//                                         counter['report process finished']()
//                                     },
//                                     (exception) => {
//                                         temp_exceptions[$.key] = exception
//                                         counter['report process finished']()
//                                     },
//                                 )
//                             })
//                         },
//                         () => {
//                             if (Object.keys(temp_exceptions).length > 0) {
//                                 on_dictionary_exception(dictionary_literal(temp_exceptions))
//                             } else {
//                                 on_dictionary_value(dictionary_literal(temp_values))
//                             }
//                         }
//                     )
//                 }
//             }
//         )
//     }




//     map_async<NT>(on_element_value: ($: T) => _et.Async_Value<NT>): _et.Async_Value<_et.Array<NT>> {
//         const data = this.data
//         return create_Async_Value(
//             {
//                 'execute': (on_array_value) => {
//                     const temp: NT[] = []
//                     create_asynchronous_processes_monitor(
//                         (registry) => {
//                             data.map(on_element_value).forEach((v) => {
//                                 registry['report process started']()
//                                 v.__start((v) => {
//                                     temp.push(v)
//                                     registry['report process finished']()
//                                 })
//                             })
//                         },
//                         () => {
//                             on_array_value(array_literal(temp))
//                         }
//                     )
//                 }
//             },
//         )
//     }
//     map_async_unsafe<NT, NE>(
//         on_element_value: ($: T) => _et.Unsafe_Async_Value<NT, NE>
//     ): _et.Unsafe_Async_Value<_et.Array<NT>, _et.Array<NE>> {
//         const data = this.data
//         return create_Unsafe_Async_Value(
//             {
//                 'execute': (
//                     on_array_value,
//                     on_array_exception,
//                 ) => {
//                     const temp_values: NT[] = []
//                     const temp_exceptions: NE[] = []
//                     create_asynchronous_processes_monitor(
//                         (registry) => {
//                             data.map(on_element_value).forEach((v) => {
//                                 registry['report process started']()
//                                 v.__start(
//                                     ($) => {
//                                         temp_values.push($)
//                                         registry['report process finished']()
//                                     },
//                                     ($) => {
//                                         temp_exceptions.push($)
//                                         registry['report process finished']()
//                                     }
//                                 )
//                             })
//                         },
//                         () => {
//                             if (temp_exceptions.length > 0) {
//                                 on_array_exception(array_literal(temp_exceptions))
//                             } else {
//                                 on_array_value(array_literal(temp_values))
//                             }
//                         }
//                     )
//                 }
//             },
//         )
//     }