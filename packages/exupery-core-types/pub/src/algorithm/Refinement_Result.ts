import { Refiner_Old } from "./Refiner"
import { Transformer_New } from "./Transformer"

export interface Refinement_Result<Output, Error> {
    transform<Target>(
        output_transformer: Transformer_New<Output, Target>,
        error_transformer: Transformer_New<Error, Target>,
    ): Target

    transform_result<New_Output>(
        transformer: Transformer_New<Output, New_Output>
    ): Refinement_Result<New_Output, Error>

    deprecated_transform_error<New_Error>(
        error_transformer: Transformer_New<Error, New_Error>,
    ): Refinement_Result<Output, New_Error>

    refine<New_Output, Refiner_Error>(
        refiner: Refiner_Old<New_Output, Refiner_Error, Output>,

        /**
         * if the refiner fails, rework its error into the desired error type
         */
        error_transformer: Transformer_New<Refiner_Error, Error>,
    ): Refinement_Result<New_Output, Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

