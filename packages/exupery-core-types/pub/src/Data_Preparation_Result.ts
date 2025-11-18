import { Data_Preparer } from "./Data_Preparer"
import { Transformer_Without_Parameters } from "./Transformer"

export interface Data_Preparation_Result<Output, Target_Error> {

    transform<New_Output>(
        transformer: Transformer_Without_Parameters<New_Output, Output>
    ): Data_Preparation_Result<New_Output, Target_Error>

    transform_error_temp<New_Target_Error>(
        transform_error: Transformer_Without_Parameters<New_Target_Error, Target_Error>,
    ): Data_Preparation_Result<Output, New_Target_Error>

    process_without_error_transformation<New_Output>(
        processor: Data_Preparer<Output, New_Output, Target_Error>
    ): Data_Preparation_Result<New_Output, Target_Error>
    
    process<New_Output, Processor_Error>(
        processor: Data_Preparer<Output, New_Output, Processor_Error>,
        transform_error: (error: Processor_Error) => Target_Error,
    ): Data_Preparation_Result<New_Output, Target_Error>

    rework_error_temp<New_Target_Error, Rework_Error>(
        rework_error: Data_Preparer<Target_Error, New_Target_Error, Rework_Error>,
        transform_rework_error: Transformer_Without_Parameters<New_Target_Error, Rework_Error>,
    ): Data_Preparation_Result<Output, New_Target_Error>

    __extract_data: (
        success: ($: Output) => void,
        error: ($: Target_Error) => void
    ) => void

}

