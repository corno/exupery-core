import { Query } from "./Query"

export type Query_Function<Result, Error, Parameters, Query_Resources> = ($q: Query_Resources) => Query<Result, Error, Parameters>
