import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { Unsafe_Command_Result } from "./Unsafe_Command_Result"
import { Safe_Command_Result } from "./Safe_Command_Result"

import { __execute_safe_command } from "./execute_safe_command"
import { __run_safe_query } from "./run_safe_query"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"


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

    if_exception_then(
        handle_exception: ($: E) => Safe_Command_Result
    ): Unsafe_Command_Result<E> {
        return new Unsafe_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle_exception($).__start(
                            () => new_on_exception($),
                        )
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($: E) => Safe_Command_Result
    ): Safe_Command_Result {
        return __execute_safe_command({
            'execute': (new_on_success) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle_exception($).__start(
                            new_on_success,
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

    then(
        handle: () => Unsafe_Command_Result<E>
    ): Unsafe_Command_Result<E> {
        return new Unsafe_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        handle().__start(
                            new_on_success,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    then_dictionary<E2>(
        $: _et.Dictionary<Unsafe_Command_Result<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Command_Result<E> {
        let exceptions: { [key: string]: E2 } = {}
        return __execute_unsafe_command({
            'execute': (on_success, on_exception) => {
                create_asynchronous_processes_monitor(
                    (monitor) => {
                        $.map(($, key) => {
                            monitor['report process started']()

                            $.__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    exceptions[key] = e
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        if (Object.keys(exceptions).length === 0) {
                            on_success()
                        } else {
                            on_exception(aggregate_exceptions(_ei.dictionary_literal(exceptions)))
                        }
                    }
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