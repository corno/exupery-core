import { Data_Preparation_Result } from "./Data_Preparation_Result"
import { Data_Preparer } from "./Data_Preparer"

export type Query_Procedure<Parameters, Result, Error, Resources> = ($r: Resources) => Data_Preparer<Parameters, Result, Error>
