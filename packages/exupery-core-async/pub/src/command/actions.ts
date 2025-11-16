import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { __create_command_promise } from "./creaters/create_command_promise"
import { create_asynchronous_processes_monitor } from '../create_asynchronous_processes_monitor'
import { Basic_Command } from './creaters/create_command'

export namespace p {

    export const array_parallel = <Error, Element_Error>(
        the_array: _et.Array<_et.Command_Promise<Element_Error>>,
        aggregate_errors: _et.Transformer_Without_Parameters<_et.Array<Element_Error>, Error>,

    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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
        array: _et.Array<_et.Command_Promise<Error>>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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


    export const assert_async = <Error>(
        assertion: _et.Query_Promise<boolean, Error>,
        error_if_failed: Error,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                assertion.__start(
                    ($) => {
                        if ($) {
                            on_success()
                        } else {
                            on_error(error_if_failed)
                        }
                    },
                    ($) => {
                        on_error($)
                    }
                )
            }
        })
    }


    export const assert_sync = <Error>(
        assertion: boolean,
        error_if_failed: Error,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                if (!assertion) {
                    on_error(error_if_failed)
                    return
                }
                on_success()
            }
        })
    }

    export const conditional_async = <Error>(
        precondition: _et.Query_Promise<boolean, Error>,
        procedure: _et.Command_Promise<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                precondition.__start(
                    ($) => {
                        if ($) {
                            procedure.__start(
                                on_success,
                                on_error
                            )
                        } else {
                            on_success()
                        }
                    },
                    on_error
                )
            }
        })
    }

    export const conditional_sync = <Error>(
        precondition: boolean,
        procedure: _et.Command_Promise<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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

    export const conditional_on_processor = <Procedure_Input, Error>(
        precondition: _et.Process_Result<Procedure_Input, Error>,
        procedure: Basic_Command<Procedure_Input, Error>, // ($: Procedure_Input) => _et.Command_Promise<Error> (maybe it is better to have the non-basic one here?)
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                precondition.__extract_data(
                    ($) => {
                        procedure($).__start(
                            on_success,
                            on_error
                        )
                    },
                    on_error
                )
            }
        })
    }

    export const conditional_on_refiner = <Procedure_Input, Refinement_Error, Error>(
        precondition: _et.Refinement_Result<Procedure_Input, Refinement_Error>,
        error_transformer: _et.Transformer_Without_Parameters<Refinement_Error, Error>,
        procedure: Basic_Command<Procedure_Input, Error>, // ($: Procedure_Input) => _et.Command_Promise<Error> (maybe it is better to have the non-basic one here?)
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                precondition.process(
                    ($) => {
                        procedure($).__start(
                            on_success,
                            on_error
                        )
                    },
                    (e) => {
                        on_error(error_transformer(e))
                    }
                )
            }
        })
    }

    export const dictionary_serie = <Error, Entry_Error>(
        dictionary: _et.Dictionary<_et.Command_Promise<Entry_Error>>,
        transform_error: _et.Transformer_Without_Parameters<_et.Key_Value_Pair<Entry_Error>, Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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
                                    on_error(transform_error({
                                        'value': $,
                                        'key': key,
                                    }))
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



    export const dictionary_parallel = <Error, Entry_Error>(
        dictionary: _et.Dictionary<_et.Command_Promise<Entry_Error>>,
        aggregate_errors: _et.Transformer_Without_Parameters<_et.Dictionary<Entry_Error>, Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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


    export const dictionary_parallel_without_transforming_the_error = <Error, Entry_Error>(
        dictionary: _et.Dictionary<_et.Command_Promise<Entry_Error>>,
    ): _et.Command_Promise<_et.Dictionary<Entry_Error>> => {
        return __create_command_promise({
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
                            on_error(_ei.dictionary_literal(errors))
                        }
                    }
                )
            }
        })
    }


    export const execute_with_async_data = <Parameters, Error>(
        procedure: _et.Command<Parameters, Error>,
        query: _et.Query_Promise<Parameters, Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                query.__start(
                    (query_result) => {
                        procedure['execute with synchronous data without error transformation'](query_result).__start(
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
        steps: _et.Command_Promise<Error>[]
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
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