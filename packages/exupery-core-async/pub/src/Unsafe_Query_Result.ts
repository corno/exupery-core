import { Safe_Command_Result } from "./Safe_Command_Result"
import { Safe_Query_Result } from "./Safe_Query_Result"
import { Unsafe_Command_Result } from "./Unsafe_Command_Result"

export interface Unsafe_Query_Result<T, E> {
    map<NT>(
        handle_value: ($: T) => NT
    ): Unsafe_Query_Result<NT, E>

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Query_Result<T, NE>

    then<NT>(
        handle_value: ($: T) => Unsafe_Query_Result<NT, E>
    ): Unsafe_Query_Result<NT, E>

    catch(
        handle_exception: ($: E) => T
    ): Safe_Query_Result<T>

    execute_unsafe_command(
        handle_value: ($: T) => Unsafe_Command_Result<E>
    ): Unsafe_Command_Result<E>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
