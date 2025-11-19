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
        processor: Stager<New_Output, Error, Output>
    ): Staging_Result<New_Output, Error>
    
    stage<New_Output, Processor_Error>(
        processor: Stager<New_Output, Processor_Error, Output>,
        error_transformer: (error: Processor_Error) => Error,
    ): Staging_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Stager<New_Error, Rework_Error, Error>,
        rework_error_transformer: Transformer<New_Error, Rework_Error>,
    ): Staging_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

