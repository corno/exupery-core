import { Refiner_With_Parameters, Refiner_Without_Parameters } from "./Refiner"
import { Transformer_With_Parameters, Transformer_Without_Parameters } from "./Transformer"

export interface Process_Result<Output, Error> {
    'transform': <NewOutput>(
        transformer: Transformer_Without_Parameters<Output, NewOutput>
    ) => Process_Result<NewOutput, Error>
    'transform with parameters': <NewOutput, Parameters>(
        transformer: Transformer_With_Parameters<Output, Parameters, NewOutput>,
        parameters: Parameters
    ) => Process_Result<NewOutput, Error>
    'refine': <NewOutput, Refine_Error>(
        refiner: Refiner_Without_Parameters<Output, NewOutput, Refine_Error>,
        map_error: ($: Refine_Error) => Error
    ) => Process_Result<NewOutput, Error>
    'refine with parameters': <NewOutput, Parameters, Refine_Error>(
        refiner: Refiner_With_Parameters<Output, Parameters, NewOutput, Refine_Error>,
        parameters: Parameters,
        map_error: ($: Refine_Error) => Error
    ) => Process_Result<NewOutput, Error>
    __extract_data: (
        success: ($: Output) => void,
        exception: ($: Error) => void
    ) => void
}