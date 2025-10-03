import { Unguaranteed_Query_Result } from "./Unguaranteed_Query_Result";

export type Unguaranteed_Query<Parameters, Result, Error> = ($: Parameters) => Unguaranteed_Query_Result<Result, Error>