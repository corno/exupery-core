export interface Unsafe_Command_Result<E> {

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Command_Result<NE>

    if_exception_then<NE>(
        handle_exception: ($: E) => Unsafe_Command_Result<NE>
    ): Unsafe_Command_Result<NE>

    // catch(
    //     handle_exception: ($: E) => T
    // ): Async_Value<T>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
