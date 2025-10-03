import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { create_asynchronous_processes_monitor } from "../create_asynchronous_processes_monitor"

import { __run_guaranteed_query } from "../query/run_guaranteed_query"
import { Unguaranteed_Query_Result } from "../query/Unguaranteed_Query_Result"
import { Guaranteed_Query_Result } from "../query/Guaranteed_Query_Result"

import { Unguaranteed_Action, Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"
import { Guaranteed_Action, Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { __execute_guaranteed_action, initialize_guaranteed_procedure_context } from "./initialize_guaranteed_procedure_context"


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

    process_guaranteed_data<Params, Query_Result>(
        action: Unguaranteed_Action<Params, E>,
        get_data: () => Guaranteed_Query_Result<Query_Result>,
        get_parameters: ($: Query_Result) => Params,
    ): Unguaranteed_Procedure_Context<E> {
        return __execute_unguaranteed_action(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        () => {
                            get_data().__start(
                                (value) => {
                                    const params = get_parameters(value)
                                    action(params).__start(
                                        on_success,
                                        on_exception,
                                    )
                                },
                            )
                        },
                        on_exception // if there was an exception before, there is nothing to do
                    )
                }
            }
        )
    }

    process_unguaranteed_data<Params, Query_Result, New_Exception>(
        action: Unguaranteed_Action<Params, E>,
        get_data: () => Unguaranteed_Query_Result<Query_Result, New_Exception>,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: New_Exception) => Guaranteed_Procedure_Context,
        map_exception: ($: New_Exception) => E,
        get_parameters: ($: Query_Result) => Params,
    ): Unguaranteed_Procedure_Context<E> {
        return __execute_unguaranteed_action(
            {
                'execute': (on_success, on_exception) => {
                    this.executer.execute(
                        () => {
                            get_data().__start(
                                (value) => {
                                    //the data was successfully retrieved
                                    const params = get_parameters(value)
                                    action(params).__start(
                                        on_success,
                                        on_exception,
                                    )
                                },
                                (exception) => {
                                    //data retrieval failed
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

    execute_unguaranteed<Params>(
        action: Unguaranteed_Action<Params, E>,
        get_parameters: () => Params,
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        action(get_parameters()).__start(
                            new_on_success,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }

    execute_foreign<Params, NE>(
        action: Unguaranteed_Action<Params, NE>,
        get_parameters: () => Params,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: NE) => Guaranteed_Procedure_Context,
        map_exception: ($: NE) => E
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        action(get_parameters()).__start(
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

    execute<Params>(
        action: Guaranteed_Action<Params>,
        get_parameters: () => Params
    ): Unguaranteed_Procedure_Context<E> {
        return new Unguaranteed_Command_Result_Class<E>({
            'execute': (new_on_success, new_on_exception) => {
                this.executer.execute(
                    () => {
                        action(get_parameters()).__start(new_on_success)
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