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
     * processes the queried data by executing a command.
     * 
     * if the result on which this method is called is in an exception state, the command will not be executed.
     * instead, the 2 other handlers will be called.
     * first, the exception handler will be called, to report the exception.
     * secondly, the exception will be mapped into a new exception value that has the same type as the command's exception type.
     * 
     * @param handle_value the handler that will be called to process the queried data, if no exception has occurred
     * @param handle_exception the handler that will process an exception if the query is in an exception state to allow reporting the exception
     * @param map_exception the handler that will map the exception of the query into a new exception value of the command's exception type
     * 
     */
    process<NE>(
        handle_exception: ($: E) => Safe_Command_Result,
        map_exception: ($: E) => NE,
        handle_value: ($: T) => Unsafe_Command_Result<NE>,
    ): Unsafe_Command_Result<NE>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
