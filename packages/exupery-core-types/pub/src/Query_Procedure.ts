import { Staging_Result } from "./Staging_Result"
import { Query } from "./Stager"

export type Query_Procedure<Result, Error, Parameters, Query_Resources> = ($q: Query_Resources) => Query<Result, Error, Parameters>
