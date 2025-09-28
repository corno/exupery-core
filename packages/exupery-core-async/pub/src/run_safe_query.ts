import * as _et from "exupery-core-types"

import { Safe_Query_Result } from "./Safe_Query_Result"
import { Safe_Command_Result } from "./Safe_Command_Result"
import { __execute_safe_command } from "./execute_safe_command"
import { Unsafe_Command_Result } from "./Unsafe_Command_Result"
import { __execute_unsafe_command } from "./execute_unsafe_command"

type Executer<T> = {
    'execute': (
        on_value: ($: T) => void
    ) => void
}


class Safe_Query_Result_Class<T> implements Safe_Query_Result<T> {
    private executer: Executer<T>
    constructor(executer: Executer<T>) {
        this.executer = executer
    }

    map<NT>(
        handle_value: ($: T) => NT
    ): Safe_Query_Result<NT> {
        return __run_safe_query(
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
        handle_value: ($: T) => Safe_Query_Result<NT>
    ): Safe_Query_Result<NT> {
        return __run_safe_query(
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
    process_safe(
        handle_value: ($: T) => Safe_Command_Result,
    ): Safe_Command_Result {
        return __execute_safe_command(
            {
                'execute': (on_success) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(value).__start(on_success)
                        }
                    )
                }
            }
        )
    }
    process_unsafe<E>(
        handle_value: ($: T) => Unsafe_Command_Result<E>
    ): Unsafe_Command_Result<E> {
        return __execute_unsafe_command(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(value).__start(
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
export function __run_safe_query<T>(
    executer: Executer<T>,
): Safe_Query_Result<T> {
    return new Safe_Query_Result_Class<T>(executer)

}