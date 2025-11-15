import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { __create_procedure_promise } from "../algorithms/procedure/create_procedure_promise"
import { q } from "./query"
import { create_asynchronous_processes_monitor } from '../create_asynchronous_processes_monitor'

export type Assert_Async_Error<Assertion_Error, Procedure_Error> =
    | ['assertion error', Assertion_Error]
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export type Assert_Sync_Error<Procedure_Error> =
    | ['assertion failed', null]
    | ['procedure error', Procedure_Error]

export type Conditional_Async_Error<Precondition_Error, Procedure_Error> =
    | ['precondition', Precondition_Error]
    | ['procedure', Procedure_Error]

export type Conditional_Multiple_Error<Precondition_Error, Procedure_Error> =
    | ['preconditions', _et.Dictionary<Precondition_Error>]
    | ['procedure', Procedure_Error]


export type Dictionary_Serie_Error<Err> = {
    'error': Err
    'step': string
}

export namespace p {

    export const array_parallel = <Error, Element_Error>(
        the_array: _et.Array<_et.Procedure_Promise<Element_Error>>,
        aggregate_errors: _et.Transformer_Without_Parameters<_et.Array<Element_Error>, Error>,

    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const errors: Element_Error[] = []

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        the_array.map(($) => {
                            monitor['report process started']()

                            $.__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    errors.push(e)
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        if (errors.length === 0) {
                            on_success()
                        } else {
                            on_error(aggregate_errors(_ei.array_literal(errors)))
                        }
                    }
                )
            }
        })
    }


    export const array_serie = <Error>(
        array: _et.Array<_et.Procedure_Promise<Error>>,
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {

                let current = 0

                const do_next = () => {
                    array.__get_element_at(current).transform(
                        ($) => {
                            current += 1
                            $.__start(
                                () => {
                                    do_next()
                                },
                                on_error
                            )
                        },
                        () => {
                            on_success()
                        }
                    )
                }
                do_next()
            }
        })
    }


    export const assert_async = <Assertion_Error, Procedure_Error>(
        assertion: _et.Query_Promise<boolean, Assertion_Error>,
        procedure: _et.Procedure_Promise<Procedure_Error>,
    ): _et.Procedure_Promise<Assert_Async_Error<Assertion_Error, Procedure_Error>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                assertion.__start(
                    ($) => {
                        if ($) {
                            procedure.__start(
                                on_success,
                                ($) => {
                                    on_error(['procedure error', $])
                                }
                            )
                        } else {
                            on_error(['assertion failed', null])
                        }
                    },
                    ($) => {
                        on_error(['assertion error', $])
                    }
                )
            }
        })
    }
    export const assert_sync = <Assertion_Error, Procedure_Error>(
        assertion: boolean,
        procedure: _et.Procedure_Promise<Procedure_Error>,
    ): _et.Procedure_Promise<Assert_Sync_Error<Procedure_Error>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                if (!assertion) {
                    on_error(['assertion failed', null])
                    return
                }
                procedure.__start(
                    on_success,
                    ($) => {
                        on_error(['procedure error', $])
                    }
                )
            }
        })
    }

    export const conditional_async = <Precondition_Error, Procedure_Error>(
        precondition: _et.Query_Promise<boolean, Precondition_Error>,
        procedure: _et.Procedure_Promise<Procedure_Error>,
    ): _et.Procedure_Promise<Conditional_Async_Error<Precondition_Error, Procedure_Error>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                precondition.__start(
                    ($) => {
                        if ($) {
                            procedure.__start(
                                on_success,
                                (e) => {
                                    on_error(
                                        ['procedure', e]
                                    )
                                }
                            )
                        } else {
                            on_success()
                        }
                    },
                    ($) => {
                        on_error(['precondition', $])
                    }
                )
            }
        })
    }

    export const conditional_multiple = <Precondition_Error, Procedure_Error>(
        preconditions: _et.Dictionary<_et.Query_Promise<boolean, Precondition_Error>>,
        procedure: _et.Procedure_Promise<Procedure_Error>,
    ): _et.Procedure_Promise<Conditional_Multiple_Error<Precondition_Error, Procedure_Error>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                q.dictionary(
                    preconditions,
                ).__start(
                    ($) => {
                        let has_errors = false
                        $.map(($) => {
                            if (!$) {
                                has_errors = true
                            }
                        })
                        if (!has_errors) {
                            // all preconditions passed
                            procedure.__start(
                                on_success,
                                (e) => {
                                    on_error(
                                        ['procedure', e]
                                    )
                                }
                            )
                        } else {
                            //the preconditions failed, so we are *successfully* skipping the procedure
                            on_success()
                        }
                    },
                    ($) => {
                        on_error(['preconditions', $])
                    }
                )
            }
        })
    }


    export const conditional_sync = <Procedure_Error>(
        precondition: boolean,
        procedure: _et.Procedure_Promise<Procedure_Error>,
    ): _et.Procedure_Promise<Procedure_Error> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                if (precondition) {
                    procedure.__start(
                        on_success,
                        on_error
                    )
                } else {
                    on_success()
                }
            }
        })
    }

    export const dictionary_serie = <Err>(
        dictionary: _et.Dictionary<_et.Procedure_Promise<Err>>,
    ): _et.Procedure_Promise<Dictionary_Serie_Error<Err>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                const op_dictionary_to_list_based_on_insertion_order = <T>(
                    dict: _et.Dictionary<T>,
                ): _et.Array<{ key: string, value: T }> => {
                    const temp: { key: string, value: T }[] = []
                    dict.map(($, key) => {
                        temp.push({ key, value: $ })
                    })
                    return _ei.array_literal(temp)
                }
                const as_list = op_dictionary_to_list_based_on_insertion_order(dictionary)

                let current = 0

                const do_next = () => {
                    as_list.__get_element_at(current).transform(
                        ($) => {
                            const key = $.key
                            current += 1
                            $.value.__start(
                                () => {
                                    do_next()
                                },
                                ($) => {
                                    on_error({
                                        'error': $,
                                        'step': key,
                                    })
                                }
                            )
                        },
                        () => {
                            on_success()
                        }
                    )
                }
                do_next()
            }
        })
    }



    export const dictionary_parallel_without_error_aggregation = <Error>(
        dictionary: _et.Dictionary<_et.Procedure_Promise<Error>>,
    ): _et.Procedure_Promise<_et.Dictionary<Error>> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                let count_down = dictionary.__get_number_of_entries()
                let has_errors = false

                const errors: { [key: string]: Error } = {}
                const decrement_and_wrap_up_if_done = () => {
                    count_down -= 1
                    if (count_down === 0) {
                        if (has_errors) {
                            on_error(_ei.dictionary_literal(errors))
                        } else {
                            on_success()
                        }
                    }
                }
                dictionary.map(($, key) => {
                    $.__start(
                        () => {
                            decrement_and_wrap_up_if_done()
                        },
                        (e) => {
                            has_errors = true
                            errors[key] = e
                            decrement_and_wrap_up_if_done()
                        },
                    )
                })
            }
        })
    }   
    
    export const dictionary_parallel = <Error, Entry_Error>(
            dictionary: _et.Dictionary<_et.Procedure_Promise<Entry_Error>>,
            aggregate_errors: _et.Transformer_Without_Parameters<_et.Dictionary<Entry_Error>, Error>,
        ): _et.Procedure_Promise<Error> => {
            return __create_procedure_promise({
                'execute': (
                    on_success,
                    on_error,
                ) => {
    
                    const errors: { [key: string]: Entry_Error } = {}
    
                    create_asynchronous_processes_monitor(
                        (monitor) => {
                            dictionary.map(($, key) => {
                                monitor['report process started']()
    
                                $.__start(
                                    () => {
                                        monitor['report process finished']()
                                    },
                                    (e) => {
                                        errors[key] = e
                                        monitor['report process finished']()
                                    }
                                )
                            })
                        },
                        () => {
                            if (Object.keys(errors).length === 0) {
                                on_success()
                            } else {
                                on_error(aggregate_errors(_ei.dictionary_literal(errors)))
                            }
                        }
                    )
                }
            })
        }


    export const execute_with_async_data = <Parameters, Error>(
        procedure: _et.Procedure_Primed_With_Resources<Parameters, Error>,
        query: _et.Query_Promise<Parameters, Error>,
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (on_success, on_error) => {
                query.__start(
                    (query_result) => {
                        procedure["execute with synchronous data"](query_result).__start(
                            on_success,
                            on_error,
                        )
                    },
                    on_error,
                )
            }
        })
    }


    export const sequence = <Error>(
        steps: _et.Procedure_Promise<Error>[]
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const length = _ei.array_literal(steps).__get_number_of_elements()
                const runStep = (index: number) => {
                    if (index >= length) {
                        on_success()
                        return
                    }
                    steps[index].__start(
                        () => runStep(index + 1),
                        on_error,
                    )
                }
                runStep(0)
            }
        })
    }

}