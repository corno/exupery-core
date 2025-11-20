import { Query_Result } from "./Query_Result"
import { Transformer } from "./Transformer"


type Stager<Output, Error, Input> = (
    $: Input,
) => Refinement_Result<Output, Error>

export interface Refinement_Result<Output, Error> {
    transform<Target>(
        output_transformer: Transformer<Target, Output>,
        error_transformer: Transformer<Target, Error>,
    ): Refinement_Result<Target, Target>

    transform_result<New_Output>(
        transformer: Transformer<New_Output, Output>
    ): Refinement_Result<New_Output, Error>

    transform_error_temp<New_Error>(
        error_transformer: Transformer<New_Error, Error>,
    ): Refinement_Result<Output, New_Error>

    refine_without_error_transformation<New_Output>(
        refiner: Stager<New_Output, Error, Output>
    ): Refinement_Result<New_Output, Error>

    refine<New_Output, Stager_Error>(
        refiner: Stager<New_Output, Stager_Error, Output>,

        /**
         * if the stager fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Stager_Error>,
    ): Refinement_Result<New_Output, Error>


    query_without_error_transformation<New_Output>(
        query: Stager<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>

    query<New_Output, Stager_Error>(
        query: Stager<New_Output, Stager_Error, Output>,
        /**
         * if the stager fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Stager_Error>,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Stager<New_Error, Rework_Error, Error>,
        /**
         * if the reworker fails, we need to transform *that* error into the New_Error
         */
        rework_error_transformer: Transformer<New_Error, Rework_Error>,
    ): Refinement_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

