import { Data_Preparation_Result } from "./Data_Preparation_Result"

export type Data_Preparer<Input, Output, Error> = ($: Input) => Data_Preparation_Result<Output, Error>

export type Data_Preparer_With_Parameters<Input, Parameters, Output, Error> = ($: Input, $p: Parameters) => Data_Preparation_Result<Output, Error>
