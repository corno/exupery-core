import * as _et from "exupery-core-types"

import { __run_guaranteed_query } from "./run_guaranteed_query"
import { Unguaranteed_Query_Result } from "./Unguaranteed_Query_Result"
import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"
import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { __execute_guaranteed_action, initialize_guaranteed_procedure_context } from "./initialize_guaranteed_procedure_context"
import { Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { __execute_unguaranteed_action, initialize_unguaranteed_procedure_context } from "./initialize_unguaranteed_procedure_context"


/**
 * this function contains the body in which the async value or exception is executed
 * after the execution, either the on_value or on_exception callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_exception the callback to call when an error is produced
 */
type Executer<T, E> = {
    'execute': (
        on_value: ($: T) => void,
        on_exception: ($: E) => void,
    ) => void
}

class Unguaranteed_Query_Result_Class<T, E> implements Unguaranteed_Query_Result<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map<NT>(
        handle_value: ($: T) => NT
    ): Unguaranteed_Query_Result<NT, E> {
        return new Unguaranteed_Query_Result_Class<NT, E>({
            'execute': (on_value, on_exception) => {
                this.executer.execute(
                    ($) => {
                        on_value(handle_value($))
                    },
                    on_exception
                )
            }
        })
    }
    then<NT>(
        handle_value: ($: T) => Unguaranteed_Query_Result<NT, E>
    ): Unguaranteed_Query_Result<NT, E> {
        return new Unguaranteed_Query_Result_Class<NT, E>({
            'execute': (new_on_value, new_on_exception) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(
                            new_on_value,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unguaranteed_Query_Result<T, NE> {
        return new Unguaranteed_Query_Result_Class<T, NE>({
            'execute': (on_value, on_exception) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        on_exception(handle_exception($))
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($: E) => Guaranteed_Query_Result<T>
    ): Guaranteed_Query_Result<T> {
        return __run_guaranteed_query<T>({
            'execute': (on_value) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        handle_exception($).__start(on_value)
                    },
                )
            }
        })
    }
    process<NE>(
        handle_exception: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context,
        map_exception: ($: E) => NE,
        handle_value: ($i: Unguaranteed_Procedure_Context<NE>, $: T) => Unguaranteed_Procedure_Context<NE>,
    ): Unguaranteed_Procedure_Context<NE> {
        return __execute_unguaranteed_action(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(initialize_unguaranteed_procedure_context(), value).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        (exception) => {
                            handle_exception(initialize_guaranteed_procedure_context(), exception).__start(
                                () => on_exception(map_exception(exception)),
                            )
                        }
                    )
                }
            }
        )
    }
    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void,
    ): void {
        this.executer.execute(on_value, on_exception)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __run_unguaranteed_query<T, E>(
    executer: Executer<T, E>,
): Unguaranteed_Query_Result<T, E> {
    return new Unguaranteed_Query_Result_Class<T, E>(executer)

}