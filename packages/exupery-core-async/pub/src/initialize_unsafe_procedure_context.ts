import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { Unsafe_Procedure_Context } from "./Unsafe_Procedure_Context"
import { Safe_Procedure_Context } from "./Safe_Procedure_Context"

import { __execute_safe_action, initialize_safe_procedure_context } from "./initialize_safe_procedure_context"
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

class Unsafe_Command_Result_Class<E> implements Unsafe_Procedure_Context<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }

    process_exception<NE>(
        handle: ($i: Safe_Procedure_Context, $: E) => Safe_Procedure_Context,
        map: ($: E) => NE,

    ): Unsafe_Procedure_Context<NE> {
        return new Unsafe_Command_Result_Class<NE>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle(initialize_safe_procedure_context(), $).__start(
                            () => new_on_exception(map($)),
                        )
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($i: Safe_Procedure_Context, $: E) => Safe_Procedure_Context
    ): Safe_Procedure_Context {
        return __execute_safe_action({
            'execute': (new_on_success) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle_exception(initialize_safe_procedure_context(), $).__start(
                            new_on_success,
                        )
                    },
                )
            }
        })
    }

    throw_exception<E>(
        $: E
    ): Unsafe_Procedure_Context<E> {
        return __execute_unsafe_action(
            {
                'execute': (on_finished, on_exception) => {
                    this.executer.execute(
                        () => {
                            on_exception($)
                        },
                        () => on_exception($)
                    )
                }
            }
        )
    }

    execute_unsafe(
        handle: ($i: Unsafe_Procedure_Context<E>) => Unsafe_Procedure_Context<E>
    ): Unsafe_Procedure_Context<E> {
        return new Unsafe_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        handle(initialize_unsafe_procedure_context()).__start(
                            new_on_success,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }

    execute(
        handle: ($i: Safe_Procedure_Context) => Safe_Procedure_Context
    ): Unsafe_Procedure_Context<E> {
        return new Unsafe_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        handle(initialize_safe_procedure_context()).__start(
                            new_on_success,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    execute_dictionary_unsafe<E2>(
        $: _et.Dictionary<Unsafe_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Procedure_Context<E> {
        let exceptions: { [key: string]: E2 } = {}
        return __execute_unsafe_action({
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
    execute_multiple_unsafe<E2>(
        $: _et.Array<Unsafe_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Unsafe_Procedure_Context<E> {
        let exceptions: E2[] = []
        return __execute_unsafe_action({
            'execute': (on_success, on_exception) => {
                create_asynchronous_processes_monitor(
                    (monitor) => {
                        $.map(($) => {
                            monitor['report process started']()
                            $.__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    exceptions.push(e)
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        if (exceptions.length === 0) {
                            on_success()
                        } else {
                            on_exception(aggregate_exceptions(_ei.array_literal(exceptions)))
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
export function __execute_unsafe_action<E>(
    executer: Executer<E>,
): Unsafe_Procedure_Context<E> {
    return new Unsafe_Command_Result_Class<E>(executer)

}

export const initialize_unsafe_procedure_context = <E>(
): Unsafe_Procedure_Context<E> => {
    return new Unsafe_Command_Result_Class<E>({
        'execute': (on_success, on_exception) => {
            on_success() //nothing to do, call on_finished immediately
        }
    })
}