import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"

import { __execute_guaranteed_action, initialize_guaranteed_procedure_context } from "./initialize_guaranteed_procedure_context"
import { __run_guaranteed_query } from "./run_guaranteed_query"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"
import { Unguaranteed_Query_Result } from "./Unguaranteed_Query_Result"


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

class Unguaranteed_Command_Result_Class<E> implements Unguaranteed_Procedure_Context<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }


    process_unguaranteed_data<T, NE>(
        get_data: () => Unguaranteed_Query_Result<T, NE>,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: NE) => Guaranteed_Procedure_Context,
        map_exception: ($: NE) => E,
        handle_data: ($i: Unguaranteed_Procedure_Context<E>, $: T) => Unguaranteed_Procedure_Context<E>,
    ): Unguaranteed_Procedure_Context<E> {
        return __execute_unguaranteed_action(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        () => {
                            get_data().__start(
                                (value) => {
                                    handle_data(initialize_unguaranteed_procedure_context(), value).__start(
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
                        },
                        on_exception // if there was an exception before, there is nothing to do
                    )
                }
            }
        )
    }

    process_exception_deprecated<NE>(
        handle: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context,
        map: ($: E) => NE,

    ): Unguaranteed_Procedure_Context<NE> {
        return new Unguaranteed_Command_Result_Class<NE>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle(initialize_guaranteed_procedure_context(), $).__start(
                            () => new_on_exception(map($)),
                        )
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context {
        return __execute_guaranteed_action({
            'execute': (new_on_success) => {
                this.executer.execute(
                    new_on_success,
                    ($) => {
                        handle_exception(initialize_guaranteed_procedure_context(), $).__start(
                            new_on_success,
                        )
                    },
                )
            }
        })
    }

    throw_exception<E>(
        $: E
    ): Unguaranteed_Procedure_Context<E> {
        return __execute_unguaranteed_action(
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

    execute_unguaranteed(
        handle: ($i: Unguaranteed_Procedure_Context<E>) => Unguaranteed_Procedure_Context<E>
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        handle(initialize_unguaranteed_procedure_context()).__start(
                            new_on_success,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }

    execute_foreign<NE>(
        executer: ($i: Unguaranteed_Procedure_Context<NE>) => Unguaranteed_Procedure_Context<NE>,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: NE) => Guaranteed_Procedure_Context,
        map_exception: ($: NE) => E
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        executer(initialize_unguaranteed_procedure_context()).__start(
                            new_on_success,
                            ($) => {
                                handle_exception(initialize_guaranteed_procedure_context(), $).__start(
                                    () => {
                                        new_on_exception(map_exception($))
                                    },
                                )
                            },
                        )
                    },
                    new_on_exception, // if there was an exception before, there is nothing to do
                )
            }
        })
    }

    execute(
        handle: ($i: Guaranteed_Procedure_Context) => Guaranteed_Procedure_Context
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        handle(initialize_guaranteed_procedure_context()).__start(
                            new_on_success,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    execute_dictionary_unguaranteed<E2>(
        $: _et.Dictionary<Unguaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unguaranteed_Procedure_Context<E> {
        let exceptions: { [key: string]: E2 } = {}
        return __execute_unguaranteed_action({
            'execute': (on_success, on_exception) => {
                this.executer.execute(
                    () => {
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
                    },
                    on_exception, // if there was an exception before, there is nothing to do
                )
            }
        })
    }
    execute_multiple_unguaranteed<E2>(
        $: _et.Array<Unguaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Unguaranteed_Procedure_Context<E> {
        let exceptions: E2[] = []
        return __execute_unguaranteed_action({
            'execute': (on_success, on_exception) => {
                this.executer.execute(
                    () => {
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
                    },
                    on_exception, // if there was an exception before, there is nothing to do
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
export function __execute_unguaranteed_action<E>(
    executer: Executer<E>,
): Unguaranteed_Procedure_Context<E> {
    return new Unguaranteed_Command_Result_Class<E>(executer)

}

export const initialize_unguaranteed_procedure_context = <E>(
): Unguaranteed_Procedure_Context<E> => {
    return new Unguaranteed_Command_Result_Class<E>({
        'execute': (on_success, on_exception) => {
            on_success() //nothing to do, call on_finished immediately
        }
    })
}