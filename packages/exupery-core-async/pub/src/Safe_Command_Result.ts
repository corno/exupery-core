

export interface Safe_Command_Result {
    then(
        handle: () => Safe_Command_Result
    ): Safe_Command_Result

    __start(
        on_finished: () => void,
    ): void
}
