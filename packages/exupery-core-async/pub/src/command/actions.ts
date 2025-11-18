import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { __create_command_promise } from "./creaters/create_command_promise"
import { create_asynchronous_processes_monitor } from '../create_asynchronous_processes_monitor'
import { Basic_Command } from './creaters/create_resource_command'

export namespace p {

    export namespace assert {
        export const direct = <Error>(
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

        export const query = <Error>(
            assertion: _et.Data_Preparation_Result<boolean, Error>,
            error_if_failed: Error,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    assertion.__extract_data(
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
    }

    export namespace conditional {
        export const direct = <Error>(
            precondition: boolean,
            procedure: _et.Command_Promise<Error>,
            else_procedure?: _et.Command_Promise<Error>,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    if (precondition) {
                        procedure.__start(
                            on_success,
                            on_error
                        )
                    } else {
                        if (else_procedure !== undefined) {
                            else_procedure.__start(
                                on_success,
                                on_error
                            )
                        } else {
                            on_success()
                        }
                    }
                }
            })
        }

        export const query = <Error>(
            precondition: _et.Data_Preparation_Result<boolean, Error>,
            procedure: _et.Command_Promise<Error>,
            else_procedure?: _et.Command_Promise<Error>,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    precondition.__extract_data(
                        ($) => {
                            if ($) {
                                procedure.__start(
                                    on_success,
                                    on_error
                                )
                            } else {
                                if (else_procedure !== undefined) {
                                    else_procedure.__start(
                                        on_success,
                                        on_error
                                    )
                                } else {
                                    on_success()
                                }
                            }
                        },
                        on_error
                    )
                }
            })
        }

        export const procedure = <Procedure_Input, Error>(
            precondition: _et.Data_Preparation_Result<Procedure_Input, Error>,
            procedure: Basic_Command<Error, Procedure_Input>, // ($: Procedure_Input) => _et.Command_Promise<Error> (maybe it is better to have the non-basic one here?)
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

    }

    export namespace list {
        export const parallel = <Error, Element_Error>(
            the_array: _et.Array<_et.Command_Promise<Element_Error>>,
            aggregate_errors: _et.Transformer_Without_Parameters<Error, _et.Array<Element_Error>>,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (
                    on_success,
                    on_error,
                ) => {

                    const errors_builder = _ei.create_procedural_list_builder<Element_Error>()

                    create_asynchronous_processes_monitor(
                        (monitor) => {
                            the_array.map(($) => {
                                monitor['report process started']()

                                $.__start(
                                    () => {
                                        monitor['report process finished']()
                                    },
                                    (e) => {
                                        errors_builder['add item'](e)
                                        monitor['report process finished']()
                                    }
                                )
                            })
                        },
                        () => {
                            const errors = errors_builder['get list']()
                            if (errors.__get_number_of_elements() === 0) {
                                on_success()
                            } else {
                                on_error(aggregate_errors(errors))
                            }
                        }
                    )
                }
            })
        }

        export const serie = <Error>(
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
    }

    export namespace dictionary {

        export namespace parallel {

            export const direct = <T, Error, Entry_Error>(
                dictionary: _et.Dictionary<T>,
                callback: (value: T, key: string) => _et.Command_Promise<Entry_Error>,
                aggregate_errors: _et.Transformer_Without_Parameters<Error, _et.Dictionary<Entry_Error>>,
            ): _et.Command_Promise<Error> => {
                return __create_command_promise({
                    'execute': (
                        on_success,
                        on_error,
                    ) => {

                        const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()

                        create_asynchronous_processes_monitor(
                            (monitor) => {
                                dictionary.map(($, key) => {
                                    monitor['report process started']()

                                    callback($, key).__start(
                                        () => {
                                            monitor['report process finished']()
                                        },
                                        (e) => {
                                            errors_builder['add entry'](key, e)
                                            monitor['report process finished']()
                                        }
                                    )
                                })
                            },
                            () => {
                                const errors = errors_builder['get dictionary']()
                                if (errors.__get_number_of_entries() === 0) {
                                    on_success()
                                } else {
                                    on_error(aggregate_errors(errors))
                                }
                            }
                        )
                    }
                })
            }


            export const query = <T, Error, Entry_Error>(
                query: _et.Data_Preparation_Result<_et.Dictionary<T>, Error>,
                callback: (value: T, key: string) => _et.Command_Promise<Entry_Error>,
                aggregate_errors: _et.Transformer_Without_Parameters<Error, _et.Dictionary<Entry_Error>>,
            ): _et.Command_Promise<Error> => {
                return __create_command_promise({
                    'execute': (
                        on_success,
                        on_error,
                    ) => {

                        const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()



                        query.__extract_data(
                            (dictionary) => {
                                create_asynchronous_processes_monitor(
                                    (monitor) => {
                                        dictionary.map(($, key) => {
                                            monitor['report process started']()

                                            callback($, key).__start(
                                                () => {
                                                    monitor['report process finished']()
                                                },
                                                (e) => {
                                                    errors_builder['add entry'](key, e)
                                                    monitor['report process finished']()
                                                }
                                            )
                                        })
                                    },
                                    () => {
                                        const errors = errors_builder['get dictionary']()
                                        if (errors.__get_number_of_entries() === 0) {
                                            on_success()
                                        } else {
                                            on_error(aggregate_errors(errors))
                                        }
                                    }
                                )
                            },
                            on_error
                        )
                    }
                })
            }
        }

        export const serie = <Error, Entry_Error>(
            dictionary: _et.Dictionary<_et.Command_Promise<Entry_Error>>,
            transform_error: _et.Transformer_Without_Parameters<Error, _et.Key_Value_Pair<Entry_Error>>,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    const as_list = dictionary.deprecated_to_array(() => 1)

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

        export const parallel_without_transforming_the_error = <Error, Entry_Error>(
            dictionary: _et.Dictionary<_et.Command_Promise<Entry_Error>>,
        ): _et.Command_Promise<_et.Dictionary<Entry_Error>> => {
            return __create_command_promise({
                'execute': (
                    on_success,
                    on_error,
                ) => {

                    const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()

                    create_asynchronous_processes_monitor(
                        (monitor) => {
                            dictionary.map(($, key) => {
                                monitor['report process started']()

                                $.__start(
                                    () => {
                                        monitor['report process finished']()
                                    },
                                    (e) => {
                                        errors_builder['add entry'](key, e)
                                        monitor['report process finished']()
                                    }
                                )
                            })
                        },
                        () => {
                            const errors = errors_builder['get dictionary']()
                            if (errors.__get_number_of_entries() === 0) {
                                on_success()
                            } else {
                                on_error(errors)
                            }
                        }
                    )
                }
            })
        }
    }


    // Sequencing function:
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