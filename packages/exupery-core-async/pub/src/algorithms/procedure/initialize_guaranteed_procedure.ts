import * as _et from "exupery-core-types"

import { Guaranteed_Procedure, Guaranteed_Procedure_Promise } from "../../types/Guaranteed_Procedure"
import { __create_unguaranteed_procedure } from "./initialize_unguaranteed_procedure"

type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Guaranteed_Procedure_Class implements Guaranteed_Procedure_Promise {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
    }
    x_execute<Parameters, Resources>(
        get_action: () => Guaranteed_Procedure<Parameters, Resources>,
        get_parameters: () => Parameters,
        get_resources: () => Resources
    ): Guaranteed_Procedure_Promise {
        return __create_guaranted_procedure(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            const action = get_action()
                            const params = get_parameters()
                            const resources = get_resources()
                            action(params, resources).__start(on_finished)
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
export function __create_guaranted_procedure(
    executer: Executer,
): Guaranteed_Procedure_Promise {
    return new Guaranteed_Procedure_Class(executer)

}

export const initialize_no_op_guaranteed_procedure = (
): Guaranteed_Procedure_Promise => {
    return new Guaranteed_Procedure_Class({
        'execute': (on_finished) => {
            on_finished() //nothing to do, call on_finished immediately
        }
    })
}