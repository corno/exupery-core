import * as _et from "exupery-core-types"

import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"
import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { __execute_guaranteed_action, initialize_guaranteed_procedure_context } from "./initialize_guaranteed_procedure_context"
import { Ungaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { __execute_unguaranteed_action, initialize_unguaranteed_procedure_context } from "./initialize_unguaranteed_procedure_context"

type Executer<T> = {
    'execute': (
        on_value: ($: T) => void
    ) => void
}


class Guaranteed_Query_Result_Class<T> implements Guaranteed_Query_Result<T> {
    private executer: Executer<T>
    constructor(executer: Executer<T>) {
        this.executer = executer
    }

    map<NT>(
        handle_value: ($: T) => NT
    ): Guaranteed_Query_Result<NT> {
        return __run_guaranteed_query(
            {
                'execute': (on_value) => {
                    this.executer.execute(
                        (value) => {
                            on_value(handle_value(value))
                        }
                    )
                }
            }
        )
    }
    then<NT>(
        handle_value: ($: T) => Guaranteed_Query_Result<NT>
    ): Guaranteed_Query_Result<NT> {
        return __run_guaranteed_query(
            {
                'execute': (on_value) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(value).__start(on_value)
                        }
                    )
                }
            }
        )
    }
    process_guaranteed(
        handle_value: ($i: Guaranteed_Procedure_Context, $: T) => Guaranteed_Procedure_Context,
    ): Guaranteed_Procedure_Context {
        return __execute_guaranteed_action(
            {
                'execute': (on_success) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(initialize_guaranteed_procedure_context(), value).__start(on_success)
                        }
                    )
                }
            }
        )
    }
    process_unguaranteed<E>(
        handle_value: ($i: Ungaranteed_Procedure_Context<E>, $: T) => Ungaranteed_Procedure_Context<E>
    ): Ungaranteed_Procedure_Context<E> {
        return __execute_unguaranteed_action(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(initialize_unguaranteed_procedure_context(), value).__start(
                                on_success,
                                on_exception,
                            )
                        }
                    )
                }
            }
        )
    }

    __start(
        on_value: ($: T) => void
    ) {
        this.executer.execute(on_value)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __run_guaranteed_query<T>(
    executer: Executer<T>,
): Guaranteed_Query_Result<T> {
    return new Guaranteed_Query_Result_Class<T>(executer)

}