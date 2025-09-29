import * as _et from "exupery-core-types"

import { __run_safe_query } from "./run_safe_query"
import { Unsafe_Query_Result } from "./Unsafe_Query_Result"
import { Safe_Query_Result } from "./Safe_Query_Result"
import { Safe_Command_Result } from "./Safe_Command_Result"
import { __execute_safe_command } from "./execute_safe_command"
import { Unsafe_Command_Result } from "./Unsafe_Command_Result"
import { __execute_unsafe_command } from "./execute_unsafe_command"


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

class Unsafe_Query_Result_Class<T, E> implements Unsafe_Query_Result<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map<NT>(
        handle_value: ($: T) => NT
    ): Unsafe_Query_Result<NT, E> {
        return new Unsafe_Query_Result_Class<NT, E>({
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
        handle_value: ($: T) => Unsafe_Query_Result<NT, E>
    ): Unsafe_Query_Result<NT, E> {
        return new Unsafe_Query_Result_Class<NT, E>({
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
    ): Unsafe_Query_Result<T, NE> {
        return new Unsafe_Query_Result_Class<T, NE>({
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
        handle_exception: ($: E) => Safe_Query_Result<T>
    ): Safe_Query_Result<T> {
        return __run_safe_query<T>({
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
        handle_exception: ($: E) => Safe_Command_Result,
        map_exception: ($: E) => NE,
        handle_value: ($: T) => Unsafe_Command_Result<NE>,
    ): Unsafe_Command_Result<NE> {
        return __execute_unsafe_command(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(value).__start(
                                on_success,
                                on_exception,
                            )
                        },
                        (exception) => {
                            handle_exception(exception).__start(
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
export function __run_unsafe_query<T, E>(
    executer: Executer<T, E>,
): Unsafe_Query_Result<T, E> {
    return new Unsafe_Query_Result_Class<T, E>(executer)

}