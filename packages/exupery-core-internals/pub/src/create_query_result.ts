import * as _et from "exupery-core-types"


/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<Output, Error> = (
    on_result: ($: Output) => void,
    on_error: ($: Error) => void,
) => void

type Queryer<Output, Error, Input> = (
    $: Input,
) => _et.Query_Result<Output, Error>

type Refiner<Output, Error, Input> = (
    $: Input,
) => _et.Refinement_Result<Output, Error>

class Query_Result_Class<Output, Error> implements _et.Query_Result<Output, Error> {
    private executer: Executer<Output, Error>
    constructor(executer: Executer<Output, Error>) {
        this.executer = executer
        this.query_result = null
    }

    public query_result: null


    transform_result<New_Output>(
        transformer: _et.Transformer_New<Output, New_Output>
    ): _et.Query_Result<New_Output, Error> {
        return new Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    on_result(transformer($))
                },
                on_error,
            )
        })
    }

    deprecated_transform_error<New_Error>(
        error_transformer: _et.Transformer_New<Error, New_Error>,
    ): _et.Query_Result<Output, New_Error> {
        return new Query_Result_Class<Output, New_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    on_error(error_transformer($))
                },
            )
        })
    }

    query_without_error_transformation<New_Output>(
        queryer: Queryer<New_Output, Error, Output>
    ): _et.Query_Result<New_Output, Error> {
        return new Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    queryer($).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    query<New_Output, Query_Error>(
        queryer: Queryer<New_Output, Query_Error, Output>,
        error_transformer: _et.Transformer_New<Query_Error, Error>,
    ): _et.Query_Result<New_Output, Error> {
        return new Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    queryer($).__extract_data(
                        on_result,
                        (queryer_error) => {
                            on_error(error_transformer(queryer_error))
                        },
                    )
                },
                on_error,
            )
        })
    }


    refine_without_error_transformation<New_Output>(
        refiner: Refiner<New_Output, Error, Output>
    ): _et.Query_Result<New_Output, Error> {
        return new Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    refiner($).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    refine<New_Output, Refiner_Error>(
        refiner: Refiner<New_Output, Refiner_Error, Output>,
        error_transformer: _et.Transformer_New<Refiner_Error, Error>,
    ): _et.Query_Result<New_Output, Error> {
        return new Query_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    refiner($).__extract_data(
                        on_result,
                        (stager_error) => {
                            on_error(error_transformer(stager_error))
                        },
                    )
                },
                on_error,
            )
        })
    }

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Queryer<New_Error, Rework_Error, Error>,
        rework_error_transformer: _et.Transformer_New<Rework_Error, New_Error>,
    ): _et.Query_Result<Output, New_Error> {
        return new Query_Result_Class<Output, New_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    error_reworker($).__extract_data(
                        (new_target_error) => {
                            on_error(new_target_error)
                        },
                        (rework_error) => {
                            on_error(rework_error_transformer(rework_error))
                        },
                    )
                },
            )
        })
    }

    __extract_data(
        on_result: ($: Output) => void,
        on_error: ($: Error) => void,
    ): void {
        this.executer(on_result, on_error)
    }
}


export function __create_query_result<T, E>(
    executer: Executer<T, E>,
): _et.Query_Result<T, E> {
    return new Query_Result_Class<T, E>(executer)

}