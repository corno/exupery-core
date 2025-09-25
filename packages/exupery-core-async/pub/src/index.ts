import * as _et from "exupery-core-types"

export * from "./Safe_Query_Result"
export * from "./Unsafe_Query_Result"
export * from "./Unsafe_Command_Result"

export * from "./merge_2_safe_query_results"
export * from "./run_safe_query"
export * from "./run_unsafe_query"



export * from "./make_async"


// export const query = {
//     'safe': {

//     },
//     'unsafe': {
//     },
//     'entries': {
//         'safe': <T>(source: _et.Dictionary<T>) => new Dictionary_Query_Safe_Result<T>(source),
//         'unsafe': <T, E>(source: _et.Dictionary<T>) => new Dictionary_Query_Unsafe_Result<T, E>(source),
//     },
//     'elements': {
//         'safe': <T>(source: _et.Array<T>) => new Array_Query_Safe_Result<T>(source),
//         'unsafe': <T, E>(source: _et.Array<T>) => new Array_Query_Unsafe_Result<T, E>(source),
//     }
// }

// export const command = {
//     'safe': {

//     },
//     'unsafe': {

//     }
// }


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