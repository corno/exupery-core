import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { create_asynchronous_processes_monitor } from "../create_asynchronous_processes_monitor"

import { __create_guaranteed_query } from "../query/create_guaranteed_query"
import { _Unguaranteed_Query } from "../query/Unguaranteed_Query"
import { _Guaranteed_Query } from "../query/Guaranteed_Query"

import { Unguaranteed_Procedure_Initializer, Unguaranteed_Procedure } from "./Unguaranteed_Procedure"
import { Guaranteed_Procedure_Initializer, Guaranteed_Procedure } from "./Guaranteed_Procedure"
import { __create_guaranted_procedure, initialize_no_op_guaranteed_procedure } from "./initialize_guaranteed_procedure"


/**
 * this function contains the body in which the async value or exception is executed
 * after the execution, either the on_value or on_exception callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_exception the callback to call when an error is produced
 */
type Executer<E> = {
    'execute': (
        on_success: () => void,
        on_exception: ($: E) => void,
    ) => void
}

class Unguaranteed_Procedure_Class<E> implements Unguaranteed_Procedure<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }


    __start(
        on_success: () => void,
        on_exception: ($: E) => void,
    ): void {
        this.executer.execute(on_success, on_exception)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __create_unguaranteed_procedure<E>(
    executer: Executer<E>,
): Unguaranteed_Procedure<E> {
    return new Unguaranteed_Procedure_Class<E>(executer)

}

export const initialize_no_op_unguaranteed_procedure = <E>(
): Unguaranteed_Procedure<E> => {
    return new Unguaranteed_Procedure_Class<E>({
        'execute': (on_success, on_exception) => {
            on_success() //nothing to do, call on_finished immediately
        }
    })
}