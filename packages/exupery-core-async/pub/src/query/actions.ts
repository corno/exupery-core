import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'


export namespace q {

    export const dictionary_parallel = <Result, Error, Entry_Error>(
        dictionary: _et.Dictionary<_et.Staging_Result<Result, Entry_Error>>,
        aggregate_errors: _et.Transformer_Without_Parameters<Error, _et.Dictionary<Entry_Error>>,

    ): _et.Staging_Result<_et.Dictionary<Result>, Error> => {
        return _ei.__create_data_preparation_result((on_success, on_error) => {
            let count_down = dictionary.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Entry_Error } = {}
            const results: { [key: string]: Result } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_error(aggregate_errors(_ei.dictionary_literal(errors)))
                    } else {
                        on_success(_ei.dictionary_literal(results))
                    }
                }
            }
            dictionary.map(($, key) => {
                $.__extract_data(
                    ($) => {
                        results[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                    ($) => {
                        has_errors = true
                        errors[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        })
    }

    export const dictionary_parallel_without_error_aggregation = <Result, Error>(
        $: _et.Dictionary<_et.Staging_Result<Result, Error>>,
    ): _et.Staging_Result<_et.Dictionary<Result>, _et.Dictionary<Error>> => {
        return _ei.__create_data_preparation_result((on_success, on_error) => {
            let count_down = $.__get_number_of_entries()
            let has_errors = false

            const errors: { [key: string]: Error } = {}
            const results: { [key: string]: Result } = {}
            const decrement_and_wrap_up_if_done = () => {
                count_down -= 1
                if (count_down === 0) {
                    if (has_errors) {
                        on_error(_ei.dictionary_literal(errors))
                    } else {
                        on_success(_ei.dictionary_literal(results))
                    }
                }
            }
            $.map(($, key) => {
                $.__extract_data(
                    ($) => {
                        results[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                    ($) => {
                        has_errors = true
                        errors[key] = $
                        decrement_and_wrap_up_if_done()
                    },
                )
            })
        })
    }

    export const fixed = <Result, Error>(
        result: Result,
    ): _et.Staging_Result<Result, Error> => {
        return _ei.__create_data_preparation_result((on_success, on_error) => {
            on_success(result)
        })
    }

    export const raise_error = <T, E>(
        $: E
    ): _et.Staging_Result<T, E> => {
        return _ei.__create_data_preparation_result((on_value, on_error) => {
            on_error($)
        })
    }

}