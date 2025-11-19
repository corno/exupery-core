import { Staging_Result } from "./Staging_Result"
import { Stager } from "./Stager"

export type Query_Procedure<Result, Error, Parameters, Query_Resources> = ($q: Query_Resources) => Stager<Result, Error, Parameters>
