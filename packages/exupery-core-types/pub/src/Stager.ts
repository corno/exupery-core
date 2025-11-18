import { Staging_Result } from "./Staging_Result"

export type Stager<Output, Error, Input> = ($: Input) => Staging_Result<Output, Error>

export type Stager_With_Parameters<Output, Error, Input, Parameters> = ($: Input, $p: Parameters) => Staging_Result<Output, Error>
