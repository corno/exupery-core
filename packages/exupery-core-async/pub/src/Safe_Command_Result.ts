import { Unsafe_Command_Result } from "./Unsafe_Command_Result"


export interface Safe_Command_Result {
    then(
        handle: () => Safe_Command_Result
    ): Safe_Command_Result

    cast_to_unsafe<E>(): Unsafe_Command_Result<E>
    
    throw_exception<E>($: E): Unsafe_Command_Result<E>

    __start(
        on_finished: () => void,
    ): void
}
