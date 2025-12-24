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
class Success_Refinement_Result_Class<Output, Error> implements _et.Refinement_Result<Output, Error> {
    private output: Output
    constructor(output: Output) {
        this.output = output
    }

    transform<Target>(
        result_transformer: _et.Transformer_New<Output, Target>,
        error_transformer: _et.Transformer_New<Error, Target>,
    ): Target {
        return result_transformer(this.output)
    }

    transform_result<New_Output>(
        transformer: _et.Transformer_New<Output, New_Output>
    ): _et.Refinement_Result<New_Output, Error> {
        return new Success_Refinement_Result_Class<New_Output, Error>(transformer(this.output))
    }

    deprecated_transform_error<New_Error>(
        error_transformer: _et.Transformer_New<Error, New_Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return new Success_Refinement_Result_Class<Output, New_Error>(this.output)
    }

    refine_without_error_transformation<New_Output>(
        refiner: Refiner<New_Output, Error, Output>
    ): _et.Refinement_Result<New_Output, Error> {
        return refiner(this.output)
    }

    refine<New_Output, Stager_Error>(
        refiner: Refiner<New_Output, Stager_Error, Output>,
        error_transformer: _et.Transformer_New<Stager_Error, Error>,
    ): _et.Refinement_Result<New_Output, Error> {
        //the error transform operation is here to satisfy the signature
        return refiner(this.output).deprecated_transform_error(error_transformer)
    }

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Refiner<New_Error, Rework_Error, Error>,
        rework_error_transformer: _et.Transformer_New<Rework_Error, New_Error>,
    ): _et.Refinement_Result<Output, New_Error> {
        return new Success_Refinement_Result_Class<Output, New_Error>(this.output)
    }

    __extract_data(
        on_result: ($: Output) => void,
        on_error: ($: Error) => void,
    ): void {
        on_result(this.output)
    }
}


export function __create_success_refinement_result<T, E>(
    output: T
): _et.Refinement_Result<T, E> {
    return new Success_Refinement_Result_Class<T, E>(output)

}