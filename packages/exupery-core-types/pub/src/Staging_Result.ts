import { Stager } from "./Stager"
import { Transformer } from "./Transformer"

export interface Staging_Result<Output, Error> {

    transform<New_Output>(
        transformer: Transformer<New_Output, Output>
    ): Staging_Result<New_Output, Error>

    transform_error_temp<New_Error>(
        error_transformer: Transformer<New_Error, Error>,
    ): Staging_Result<Output, New_Error>

    stage_without_error_transformation<New_Output>(
        stager: Stager<New_Output, Error, Output>
    ): Staging_Result<New_Output, Error>
    
    stage<New_Output, Stager_Error>(
        stager: Stager<New_Output, Stager_Error, Output>,

        /**
         * if the stager fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Stager_Error>,
    ): Staging_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Stager<New_Error, Rework_Error, Error>,
        /**
         * if the reworker fails, we need to transform *that* error into the New_Error
         */
        rework_error_transformer: Transformer<New_Error, Rework_Error>,
    ): Staging_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

