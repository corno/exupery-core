import * as _et from "exupery-core-types"

import { __create_unguaranteed_procedure } from "./initialize_unguaranteed_procedure"

type Executer = {
    'execute': (
        on_finished: () => void
    ) => void
}


class Guaranteed_Procedure_Promise_Class implements _et.Guaranteed_Procedure_Promise {
    private executer: Executer
    constructor(executer: Executer) {
        this.executer = executer
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
): _et.Guaranteed_Procedure_Promise {
    return new Guaranteed_Procedure_Promise_Class(executer)
}