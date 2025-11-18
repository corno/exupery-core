import { Data_Preparer } from "./Data_Preparer"
import { Transformer_Without_Parameters } from "./Transformer"

export interface Data_Preparation_Result<Output, Error> {

    transform<New_Output>(
        transformer: Transformer_Without_Parameters<New_Output, Output>
    ): Data_Preparation_Result<New_Output, Error>

    transform_error_temp<Transform_Error>(
        error_transformer: Transformer_Without_Parameters<Error, Transform_Error>,
    ): Data_Preparation_Result<Output, Transform_Error>

    process_without_error_transformation<New_Output>(
        processor: Data_Preparer<New_Output, Error, Output>
    ): Data_Preparation_Result<New_Output, Error>
    
    process<New_Output, Processor_Error>(
        processor: Data_Preparer<New_Output, Processor_Error, Output>,
        error_transformer: (error: Processor_Error) => Error,
    ): Data_Preparation_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Data_Preparer<New_Error, Rework_Error, Error>,
        rework_error_transformer: Transformer_Without_Parameters<New_Error, Rework_Error>,
    ): Data_Preparation_Result<Output, New_Error>

    __extract_data: (
        success: ($: Output) => void,
        error: ($: Error) => void
    ) => void

}

