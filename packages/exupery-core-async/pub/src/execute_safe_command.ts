import * as _et from "exupery-core-types"

import { Safe_Command_Result } from "./Safe_Command_Result"
import { Unsafe_Command_Result } from "./Unsafe_Command_Result"
import { __execute_unsafe_command } from "./execute_unsafe_command"

type Executer = {
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
        handle: (init: Safe_Command_Result) => Safe_Command_Result
    ): Safe_Command_Result {
        return __execute_safe_command(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            handle(initialize_safe_command()).__start(on_finished)
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
export function __execute_safe_command(
    executer: Executer,
): Safe_Command_Result {
    return new Safe_Command_Result_Class(executer)

}

export const initialize_safe_command = (
): Safe_Command_Result => {
    return __execute_safe_command(
        {
            'execute': (on_success) => {
                on_success()
            }
        }
    )
}