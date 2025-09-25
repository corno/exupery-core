import { Async_Value } from "./Async_Value"

export interface Unsafe_Async_Value<T, E> {
    map<NT>($v: ($: T) => NT): Unsafe_Async_Value<NT, E>
    map_exception<NE>($e: ($: E) => NE): Unsafe_Async_Value<T, NE>

    then<NT>($v: ($: T) => Unsafe_Async_Value<NT, E>): Unsafe_Async_Value<NT, E>
    if_exception_then<NE>(handle_exception: ($: E) => Unsafe_Async_Value<T, NE>): Unsafe_Async_Value<T, NE>

    catch(
        $e: ($: E) => T
    ): Async_Value<T>

    catch_and_map<NT>(
        $v: ($: T) => NT,
        $e: ($: E) => NT,
    ): Async_Value<NT>
    __start($i: ($: T) => void, $e: ($: E) => void): void;
}
