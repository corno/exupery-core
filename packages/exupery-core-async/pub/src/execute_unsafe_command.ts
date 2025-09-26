import * as _et from "exupery-core-types"

import { Unsafe_Command_Result } from "./Unsafe_Command_Result"
import { Safe_Command_Result } from "./Safe_Command_Result"

import { __execute_safe_command } from "./execute_safe_command"
import { __run_safe_query } from "./run_safe_query"


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

class Unsafe_Command_Result_Class<E> implements Unsafe_Command_Result<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }
    if_exception_then<NE>(
        handle_exception: ($: E) => Unsafe_Command_Result<NE>
    ): Unsafe_Command_Result<NE> {
        return new Unsafe_Command_Result_Class<NE>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle_exception($).__start(
                            new_on_success,
                            new_on_exception,
                        )
                    },
                )
            }
        })
    }
    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Command_Result<NE> {
        return new Unsafe_Command_Result_Class<NE>({
            'execute': (on_success, on_exception) => {
                this.executer.execute(
                    on_success,
                    ($) => {
                        on_exception(handle_exception($))
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($: E) => void
    ): Safe_Command_Result {
        return __execute_safe_command({
            'execute': (on_success) => {
                this.executer.execute(
                    on_success,
                    ($) => {
                        handle_exception($)
                        on_success()
                    },
                )
            }
        })
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
export function __execute_unsafe_command<E>(
    executer: Executer<E>,
): Unsafe_Command_Result<E> {
    return new Unsafe_Command_Result_Class<E>(executer)

}