import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { __create_command_promise } from "./creaters/create_command_promise"
import { create_asynchronous_processes_monitor } from '../create_asynchronous_processes_monitor'
import { __sequence } from './sequence'
import { Command_Block } from './Command_Block'

export namespace p {

    export const assert = <Error>(
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

    export const fail = <Error>(
        error: Error,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                on_error(error)
            }
        })
    }


    export const if_ = <Error>(
        precondition: boolean,
        command_block: Command_Block<Error>,
        else_command_block?: Command_Block<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (on_success, on_error) => {
                if (precondition) {
                    __sequence(command_block).__start(
                        on_success,
                        on_error
                    )
                } else {
                    if (else_command_block !== undefined) {
                        __sequence(else_command_block).__start(
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

    export namespace list {

        export const parallel = <Error, Element_Error>(
            the_array: _et.List<_et.Command_Promise<Element_Error>>,
            errors_aggregator: _et.Transformer<Error, _et.List<Element_Error>>,
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
                                on_error(errors_aggregator(errors))
                            }
                        }
                    )
                }
            })
        }

        export const serie = <Error>(
            array: _et.List<_et.Command_Promise<Error>>,
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

        export const parallel = <T, Error, Entry_Error>(
            dictionary: _et.Dictionary<T>,
            block: (value: T, key: string) => Command_Block<Entry_Error>,
            aggregate_errors: _et.Transformer<Error, _et.Dictionary<Entry_Error>>,
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

                                __sequence(block($, key)).__start(
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

        export namespace deprecated_parallel {

            export const query = <T, Error, Entry_Error>(
                staging_result: _et.Staging_Result<_et.Dictionary<T>, Error>,
                block: (value: T, key: string) => Command_Block<Entry_Error>,
                aggregate_errors: _et.Transformer<Error, _et.Dictionary<Entry_Error>>,
            ): _et.Command_Promise<Error> => {
                return __create_command_promise({
                    'execute': (
                        on_success,
                        on_error,
                    ) => {

                        const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()



                        staging_result.__extract_data(
                            (dictionary) => {
                                create_asynchronous_processes_monitor(
                                    (monitor) => {
                                        dictionary.map(($, key) => {
                                            monitor['report process started']()

                                            __sequence(block($, key)).__start(
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
            error_transformer: _et.Transformer<Error, _et.Key_Value_Pair<Entry_Error>>,
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
                                        on_error(error_transformer({
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

        export const deprecated_parallel_without_transforming_the_error = <Error, Entry_Error>(
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

    export const create_error_handling_context = <Target_Error, Block_Error>(
        command_block: Command_Block<Block_Error>,
        processor: (error: Block_Error) => _et.Command_Promise<Target_Error>,
        new_error: Target_Error,
    ): _et.Command_Promise<Target_Error> => {
        return __create_command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                __sequence(command_block).__start(
                    on_success,
                    (e) => {
                        processor(e).__start(
                            () => {
                                on_error(new_error)
                            },
                            on_error,
                        )
                    }
                )
            }
        })
    }


    // Sequencing function:
    export const sequence = <Error>(
        block: Command_Block<Error>
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const length = _ei.list_literal(block).__get_number_of_elements()
                const runStep = (index: number) => {
                    if (index >= length) {
                        on_success()
                        return
                    }
                    block[index].__start(
                        () => runStep(index + 1),
                        on_error,
                    )
                }
                runStep(0)
            }
        })
    }


    export const stage_without_error_transformation = <Error, Staging_Output>(
        staging_result: _et.Staging_Result<Staging_Output, Error>,
        command_block: ($v: Staging_Output) => Command_Block<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                staging_result.__extract_data(
                    (output) => {
                        __sequence(command_block(output)).__start(
                            () => {
                                on_success()
                            },
                            (e) => {
                                on_error(e)
                            }
                        )
                    },
                    (e) => {
                        on_error(e)
                    }
                )
            }
        })
    }


    export const stage_with_error_transformation = <Error, Staging_Output, Staging_Error>(
        staging_result: _et.Staging_Result<Staging_Output, Staging_Error>,
        error_transformer: _et.Transformer<Error, Staging_Error>,
        command_block: ($v: Staging_Output) => Command_Block<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                staging_result.__extract_data(
                    (output) => {
                        __sequence(command_block(output)).__start(
                            () => {
                                on_success()
                            },
                            (e) => {
                                on_error(e)
                            }
                        )
                    },
                    (e) => {
                        on_error(error_transformer(e))
                    }
                )
            }
        })
    }



    export const stage_stacked = <Error, Staging_Output, Parent_Data>(
        staging_result: _et.Staging_Result<Staging_Output, Error>,
        parent_data: Parent_Data,
        command_block: ($v: Staging_Output, $parent: Parent_Data) => Command_Block<Error>,
    ): _et.Command_Promise<Error> => {
        return __create_command_promise({
            'execute': (
                on_success,
                on_error,
            ) => {
                staging_result.__extract_data(
                    (output) => {
                        __sequence(command_block(output, parent_data)).__start(
                            () => {
                                on_success()
                            },
                            (e) => {
                                on_error(e)
                            }
                        )
                    },
                    on_error
                )
            }
        })
    }




    export namespace deprecated_conditional {

        export const query = <Error>(
            precondition: _et.Staging_Result<boolean, Error>,
            command: _et.Command_Promise<Error>,
            else_command?: _et.Command_Promise<Error>,
        ): _et.Command_Promise<Error> => {
            return __create_command_promise({
                'execute': (on_success, on_error) => {
                    precondition.__extract_data(
                        ($) => {
                            if ($) {
                                command.__start(
                                    on_success,
                                    on_error
                                )
                            } else {
                                if (else_command !== undefined) {
                                    else_command.__start(
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

    }


    export namespace deprecated_assert {

        export const query = <Error>(
            assertion: _et.Staging_Result<boolean, Error>,
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

}