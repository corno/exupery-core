import * as _et from "exupery-core-types"

import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Ungaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { __execute_unguaranteed_action } from "./initialize_unguaranteed_procedure_context"

type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Guaranteed_Procedure_Context_Class implements Guaranteed_Procedure_Context {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
    }
    execute(
        handle: ($i: Guaranteed_Procedure_Context) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context {
        return __execute_guaranteed_action(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            handle(initialize_guaranteed_procedure_context()).__start(on_finished)
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
export function __execute_guaranteed_action(
    executer: Executer,
): Guaranteed_Procedure_Context {
    return new Guaranteed_Procedure_Context_Class(executer)

}

export const initialize_guaranteed_procedure_context = (
): Guaranteed_Procedure_Context => {
    return new Guaranteed_Procedure_Context_Class({
        'execute': (on_finished) => {
            on_finished() //nothing to do, call on_finished immediately
        }
    })
}