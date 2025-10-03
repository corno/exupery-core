import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result";

export type Guaranteed_Query<Parameters, Result> = ($: Parameters) => Guaranteed_Query_Result<Result>