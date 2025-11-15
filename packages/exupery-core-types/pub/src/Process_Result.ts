import { Refiner_With_Parameters, Refiner_Without_Parameters } from "./Refiner"
import { Transformer_With_Parameters, Transformer_Without_Parameters } from "./Transformer"

export interface Process_Result<Output, Error> {

    'transform': <New_Output>(
        transformer: Transformer_Without_Parameters<Output, New_Output>
    ) => Process_Result<New_Output, Error>

    'transform error': <New_Error>(
        transformer: Transformer_Without_Parameters<Error, New_Error>
    ) => Process_Result<Output, New_Error>

    'transform with parameters': <New_Output, Parameters>(
        transformer: Transformer_With_Parameters<Output, Parameters, New_Output>,
        parameters: Parameters
    ) => Process_Result<New_Output, Error>

    'refine': <New_Output, Refine_Error>(
        refiner: Refiner_Without_Parameters<Output, New_Output, Refine_Error>,
        map_error: ($: Refine_Error) => Error
    ) => Process_Result<New_Output, Error>

    'refine with parameters': <New_Output, Parameters, Refine_Error>(
        refiner: Refiner_With_Parameters<Output, Parameters, New_Output, Refine_Error>,
        parameters: Parameters,
        map_error: ($: Refine_Error) => Error
    ) => Process_Result<New_Output, Error>

    __extract_data: (
        success: ($: Output) => void,
        error: ($: Error) => void
    ) => void
}