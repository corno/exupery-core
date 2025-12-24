import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'


export namespace r {

    export namespace dictionary {

        export const parallel = <Result, Error, Entry_Error>(
            dictionary: _et.Dictionary<_et.Refinement_Result<Result, Entry_Error>>,
            aggregate_errors: _et.Transformer_New<_et.Dictionary<Entry_Error>, Error>,

        ): _et.Refinement_Result<_et.Dictionary<Result>, Error> => {
            let has_errors = false
            const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()
            const results_builder = _ei.create_procedural_dictionary_builder<Result>()


            dictionary.map(($, key) => {
                $.__extract_data(
                    ($) => {
                        results_builder['add entry'](key, $)
                    },
                    ($) => {
                        has_errors = true
                        errors_builder['add entry'](key, $)
                    },
                )
            })

            if (has_errors) {
                return _ei.__create_failure_refinement_result(aggregate_errors(errors_builder['get dictionary']()))
            } else {
                return _ei.__create_success_refinement_result(results_builder['get dictionary']())
            }


        }

        export const parallel_without_error_aggregation = <Result, Entry_Error>(
            dictionary: _et.Dictionary<_et.Refinement_Result<Result, Entry_Error>>,
        ): _et.Refinement_Result<_et.Dictionary<Result>, _et.Dictionary<Entry_Error>> => {
            let has_errors = false
            const errors_builder = _ei.create_procedural_dictionary_builder<Entry_Error>()
            const results_builder = _ei.create_procedural_dictionary_builder<Result>()


            dictionary.map(($, key) => {
                $.__extract_data(
                    ($) => {
                        results_builder['add entry'](key, $)
                    },
                    ($) => {
                        has_errors = true
                        errors_builder['add entry'](key, $)
                    },
                )
            })

            if (has_errors) {
                return _ei.__create_failure_refinement_result(errors_builder['get dictionary']())
            } else {
                return _ei.__create_success_refinement_result(results_builder['get dictionary']())
            }

        }

    }
}