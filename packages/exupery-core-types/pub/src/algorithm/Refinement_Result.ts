import { Refiner } from "./Refiner"
import { Transformer } from "./Transformer"

export interface Refinement_Result<Output, Error> {
    transform<Target>(
        output_transformer: Transformer<Target, Output>,
        error_transformer: Transformer<Target, Error>,
    ): Target

    transform_result<New_Output>(
        transformer: Transformer<New_Output, Output>
    ): Refinement_Result<New_Output, Error>

    deprecated_transform_error<New_Error>(
        error_transformer: Transformer<New_Error, Error>,
    ): Refinement_Result<Output, New_Error>

    refine<New_Output, Refiner_Error>(
        refiner: Refiner<New_Output, Refiner_Error, Output>,

        /**
         * if the refiner fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Refiner_Error>,
    ): Refinement_Result<New_Output, Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

