import { Unsafe_Command_Result } from "./Unsafe_Command_Result"


export interface Safe_Command_Result {
    execute(
        handle: ($i: Safe_Command_Result) => Safe_Command_Result
    ): Safe_Command_Result

    __start(
        on_finished: () => void,
    ): void
}
