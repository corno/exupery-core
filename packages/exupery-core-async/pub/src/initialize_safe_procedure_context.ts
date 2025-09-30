import * as _et from "exupery-core-types"

import { Safe_Procedure_Context } from "./Safe_Procedure_Context"
import { Unsafe_Procedure_Context } from "./Unsafe_Procedure_Context"
import { __execute_unsafe_action } from "./initialize_unsafe_procedure_context"

type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Safe_Command_Result_Class implements Safe_Procedure_Context {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
    }
    execute(
        handle: ($i: Safe_Procedure_Context) => Safe_Procedure_Context
    ): Safe_Procedure_Context {
        return __execute_safe_action(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            handle(initialize_safe_procedure_context()).__start(on_finished)
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
export function __execute_safe_action(
    executer: Executer,
): Safe_Procedure_Context {
    return new Safe_Command_Result_Class(executer)

}

export const initialize_safe_procedure_context = (
): Safe_Procedure_Context => {
    return new Safe_Command_Result_Class({
        'execute': (on_finished) => {
            on_finished() //nothing to do, call on_finished immediately
        }
    })
}