import { Transformer } from "./Transformer"

export interface Refinement_Result<Output, Error> {
    transform<Target>(
        output_transformer: Transformer<Output, Target>,
        error_transformer: Transformer<Error, Target>,
    ): Target

    transform_result<New_Output>(
        transformer: Transformer<Output, New_Output>
    ): Refinement_Result<New_Output, Error>

    deprecated_transform_error<New_Error>(
        error_transformer: Transformer<Error, New_Error>,
    ): Refinement_Result<Output, New_Error>

    deprecated_refine_old<New_Output, Refiner_Error>(
        refiner: Deprecated_Refiner_Catcher<New_Output, Refiner_Error, Output>,

        /**
         * if the refiner fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Refiner_Error, Error>,
    ): Refinement_Result<New_Output, Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}


export type Deprecated_Refiner_Catcher<Result, Error, Input> = (
    $: Input,
) => Refinement_Result<Result, Error>
