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

    /**
     * processes the queried data by executing a command,
     * if the result on which this method is called is in an exception state, the command will not be executed,
     * but a handler for the exception will be called instead.
     * That handler is not allowed to return an unsafe result, as the command has already failed.
     */
    process(
        handle_value: ($: T) => Unsafe_Command_Result<E>,
        handle_exception: ($: E) => Safe_Command_Result,
    ): Unsafe_Command_Result<E>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
