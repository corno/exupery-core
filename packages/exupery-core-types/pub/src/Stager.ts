import { Staging_Result } from "./Staging_Result"
import { Transformer } from "./Transformer"

export type Stager<Output, Error, Input> = <Target_Error>(
    $: Input,
    transform_error: Transformer<Target_Error, Error>,
) => Staging_Result<Output, Target_Error>

export type Query<Output, Error, Input> = Stager<Output, Error, Input>