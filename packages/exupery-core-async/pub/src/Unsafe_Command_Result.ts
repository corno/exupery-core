import * as _et from 'exupery-core-types'

export interface Unsafe_Command_Result<E> {

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Command_Result<NE>

    if_exception_then<NE>(
        handle_exception: ($: E) => Unsafe_Command_Result<NE>
    ): Unsafe_Command_Result<NE>
    then(
        handle: () => Unsafe_Command_Result<E> 
    ): Unsafe_Command_Result<E>

    // catch(
    //     handle_exception: ($: E) => T
    // ): Async_Value<T>

    do_dictionary<E2>(
        $: _et.Dictionary<Unsafe_Command_Result<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Command_Result<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
