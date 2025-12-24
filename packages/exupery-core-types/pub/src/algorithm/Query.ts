import { Query_Result } from "./Query_Result"
import { Transformer_New } from "./Transformer"

export type Query<Output, Error, Input> = <Target_Error>(
    $: Input,
    error_transformer: Transformer_New<Error, Target_Error>,
) => Query_Result<Output, Target_Error>