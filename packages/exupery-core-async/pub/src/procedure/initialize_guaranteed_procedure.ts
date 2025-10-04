import * as _et from "exupery-core-types"

import { Guaranteed_Procedure_Initializer, Guaranteed_Procedure } from "./Guaranteed_Procedure"
import { Unguaranteed_Procedure } from "./Unguaranteed_Procedure"
import { __create_unguaranteed_procedure } from "./initialize_unguaranteed_procedure"

type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Guaranteed_Procedure_Class implements Guaranteed_Procedure {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
    }
    x_execute<Parameters>(
        get_action: () => Guaranteed_Procedure_Initializer<Parameters>,
        get_parameters: () => Parameters
    ): Guaranteed_Procedure {
        return __create_guaranted_procedure(
            {
                'execute': (on_finished) => {
                    this.executer.execute(
                        () => {
                            const action = get_action()
                            const params = get_parameters()
                            action(params).__start(on_finished)
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
): Guaranteed_Procedure {
    return new Guaranteed_Procedure_Class(executer)

}

export const initialize_no_op_guaranteed_procedure = (
): Guaranteed_Procedure => {
    return new Guaranteed_Procedure_Class({
        'execute': (on_finished) => {
            on_finished() //nothing to do, call on_finished immediately
        }
    })
}