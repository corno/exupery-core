import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import { create_asynchronous_processes_monitor } from '../create_asynchronous_processes_monitor'


export namespace q {

    export namespace dictionary {

        export const parallel = <Result, Error, Entry_Error>(
            dictionary: _et.Dictionary<_et.Query_Result<Result, Entry_Error>>,
            aggregate_errors: _et.Transformer<_et.Dictionary<Entry_Error>, Error>,

        ): _et.Query_Result<_et.Dictionary<Result>, Error> => {
            return _ei.__create_query_result((on_success, on_error) => {
                let has_errors = false
                const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()
                const results_builder = _ei.create_procedural_dictionary_builder<Result>()

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        dictionary.map(($, key) => {
                            monitor['report process started']()
                            $.__extract_data(
                                ($) => {
                                    results_builder['add entry'](key, $)
                                    monitor['report process finished']()
                                },
                                ($) => {
                                    has_errors = true
                                    errors_builder['add entry'](key, $)
                                    monitor['report process finished']()
                                },
                            )
                        })
                    },
                    () => {
                        if (has_errors) {
                            on_error(aggregate_errors(errors_builder['get dictionary']()))
                        } else {
                            on_success(results_builder['get dictionary']())
                        }
                    }
                )
            })
        }

        export const parallel_without_error_aggregation = <Result, Error>(
            $: _et.Dictionary<_et.Query_Result<Result, Error>>,
        ): _et.Query_Result<_et.Dictionary<Result>, _et.Dictionary<Error>> => {
            return _ei.__create_query_result((on_success, on_error) => {
                let has_errors = false
                const errors_builder = _ei.create_procedural_dictionary_builder<Error>()
                const results_builder = _ei.create_procedural_dictionary_builder<Result>()

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        $.map(($, key) => {
                            monitor['report process started']()
                            $.__extract_data(
                                ($) => {
                                    results_builder['add entry'](key, $)
                                    monitor['report process finished']()
                                },
                                ($) => {
                                    has_errors = true
                                    errors_builder['add entry'](key, $)
                                    monitor['report process finished']()
                                },
                            )
                        })
                    },
                    () => {
                        if (has_errors) {
                            on_error(errors_builder['get dictionary']())
                        } else {
                            on_success(results_builder['get dictionary']())
                        }
                    }
                )
            })
        }

    }

    export const fixed = <Result, Error>(
        result: Result,
    ): _et.Query_Result<Result, Error> => {
        return _ei.__create_query_result((on_success, on_error) => {
            on_success(result)
        })
    }

    export const raise_error = <T, E>(
        $: E
    ): _et.Query_Result<T, E> => {
        return _ei.__create_query_result((on_value, on_error) => {
            on_error($)
        })
    }

}