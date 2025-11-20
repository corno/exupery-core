import { Query_Result } from "./Query_Result"
import { Query } from "./Query"

export type Query_Procedure<Result, Error, Parameters, Query_Resources> = ($q: Query_Resources) => Query<Result, Error, Parameters>
