import { Async_Value } from "./Async_Value"

export interface Unsafe_Async_Value<T, E> {
    map<NT>(
        handle_value: ($: T) => NT
    ): Unsafe_Async_Value<NT, E>

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Async_Value<T, NE>

    then<NT>(
        handle_value: ($: T) => Unsafe_Async_Value<NT, E>
    ): Unsafe_Async_Value<NT, E>

    if_exception_then<NE>(
        handle_exception: ($: E) => Unsafe_Async_Value<T, NE>
    ): Unsafe_Async_Value<T, NE>

    catch(
        handle_exception: ($: E) => T
    ): Async_Value<T>

    catch_and_map<NT>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NT,
    ): Async_Value<NT>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
