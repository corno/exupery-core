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
        return new Failure_Refinement_Result_Class<New_Output, Error>(this.error)
    }

    transform_error_temp<New_Error>(
        error_transformer: _et.Transformer<New_Error, Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return new Failure_Refinement_Result_Class<Output, New_Error>(error_transformer(this.error))
    }

    refine_without_error_transformation<New_Output>(
        refiner: Refiner<New_Output, Error, Output>
    ): _et.Refinement_Result<New_Output, Error> {
        return new Failure_Refinement_Result_Class<New_Output, Error>(this.error)
    }

    refine<New_Output, Stager_Error>(
        stager: Refiner<New_Output, Stager_Error, Output>,
        error_transformer: _et.Transformer<Error, Stager_Error>,
    ): _et.Refinement_Result<New_Output, Error> {
        return new Failure_Refinement_Result_Class<New_Output, Error>(this.error)
    }

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Refiner<New_Error, Rework_Error, Error>,
        rework_error_transformer: _et.Transformer<New_Error, Rework_Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return error_reworker(this.error).transform(
            ($) => new Failure_Refinement_Result_Class<Output, New_Error>($),
            ($) => new Failure_Refinement_Result_Class<Output, New_Error>(rework_error_transformer($))
        )
    }

    __extract_data(
        on_result: ($: Output) => void,
        on_error: ($: Error) => void,
    ): void {
        on_error(this.error)
    }
}


export function __create_failure_refinement_result<T, E>(
    error: E,
): _et.Refinement_Result<T, E> {
    return new Failure_Refinement_Result_Class<T, E>(error)

}