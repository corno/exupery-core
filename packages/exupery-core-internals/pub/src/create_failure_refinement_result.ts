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


type Refiner<Output, Error, Input> = (
    $: Input,
) => _et.Refinement_Result<Output, Error>

class Failure_Refinement_Result_Class<Output, Error> implements _et.Refinement_Result<Output, Error> {
    constructor(error: Error) {
        this.error = error
    }
    private error: Error

    transform<Target>(
        result_transformer: _et.Transformer<Target, Output>,
        error_transformer: _et.Transformer<Target, Error>,
    ): Target {
        return error_transformer(this.error)
    }

    transform_result<New_Output>(
        transformer: _et.Transformer<New_Output, Output>
    ): _et.Refinement_Result<New_Output, Error> {
        return this
    }

    transform_error_temp<New_Error>(
        error_transformer: _et.Transformer<New_Error, Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return new Failure_Refinement_Result_Class<Output, New_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    on_error(error_transformer($))
                },
            )
        })
    }

    refine_without_error_transformation<New_Output>(
        refiner: Refiner<New_Output, Error, Output>
    ): _et.Refinement_Result<New_Output, Error> {
        return new Failure_Refinement_Result_Class<New_Output, Error>((on_result, on_error) => {
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

    refine<New_Output, Stager_Error>(
        stager: _et.Stager<New_Output, Stager_Error, Output>,
        error_transformer: _et.Transformer<Error, Stager_Error>,
    ): _et.Refinement_Result<New_Output, Error> {
        return new Failure_Refinement_Result_Class<New_Output, Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    stager($).__extract_data(
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
        error_reworker: _et.Stager<New_Error, Rework_Error, Error>,
        rework_error_transformer: _et.Transformer<New_Error, Rework_Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return new Failure_Refinement_Result_Class<Output, New_Error>((on_result, on_error) => {
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


export function __create_Refinement_Result<T, E>(
    executer: Executer<T, E>,
): _et.Refinement_Result<T, E> {
    return new Failure_Refinement_Result_Class<T, E>(executer)

}