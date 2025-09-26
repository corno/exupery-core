import * as _et from "exupery-core-types"

import { Safe_Command_Result } from "./Safe_Command_Result"

export type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Safe_Command_Result_Class implements Safe_Command_Result {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
    }
    then(
        handle: () => Safe_Command_Result
    ): Safe_Command_Result {
        return execute_safe_command(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            handle().__start(on_finished)
                        }
                    )
                }
            }
        )
    }

    __start(
        on_finished: () => void
    ) {
        this.executer.execute(on_finished)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function execute_safe_command(
    executer: Executer,
): Safe_Command_Result {
    return new Safe_Command_Result_Class(executer)

}