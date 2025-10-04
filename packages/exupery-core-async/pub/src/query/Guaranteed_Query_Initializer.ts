import { _Guaranteed_Query } from "./Guaranteed_Query";

export type Guaranteed_Query_Initializer<Parameters, Result> = ($: Parameters) => _Guaranteed_Query<Result>