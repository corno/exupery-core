import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { __create_guaranteed_query } from "../query/create_guaranteed_query"
import { Unguaranteed_Query_Promise } from "../../types/Basic_Unguaranteed_Query"
import { Guaranteed_Query_Promise } from "../../types/Basic_Guaranteed_Query"

import { Unguaranteed_Procedure_Promise } from "../../types/Unguaranteed_Procedure"
import { __create_guaranted_procedure } from "./initialize_guaranteed_procedure"


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

class Unguaranteed_Procedure_Promise_Class<E> implements Unguaranteed_Procedure_Promise<E> {
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

    map_error<NE>(
        handle_error: (error: E) => NE
    ): Unguaranteed_Procedure_Promise<NE> {
        return new Unguaranteed_Procedure_Promise_Class<NE>({
            'execute': (on_success, on_exception) => {
                this.executer.execute(
                    on_success,
                    (error) => {
                        on_exception(handle_error(error))
                    }
                )
            }
        })
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __create_unguaranteed_procedure<E>(
    executer: Executer<E>,
): Unguaranteed_Procedure_Promise<E> {
    return new Unguaranteed_Procedure_Promise_Class<E>(executer)

}