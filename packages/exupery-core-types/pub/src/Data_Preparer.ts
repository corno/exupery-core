import { Data_Preparation_Result } from "./Data_Preparation_Result"

export type Data_Preparer<Output, Input, Error> = ($: Input) => Data_Preparation_Result<Output, Error>

export type Data_Preparer_With_Parameters<Output, Input, Parameters, Error> = ($: Input, $p: Parameters) => Data_Preparation_Result<Output, Error>
