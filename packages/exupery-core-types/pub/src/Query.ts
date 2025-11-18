import { Data_Preparation_Result } from "./Data_Preparation_Result"
import { Data_Preparer } from "./Data_Preparer"

export type Query_Procedure<Result, Error, Parameters, Query_Resources> = ($q: Query_Resources) => Data_Preparer<Result, Error, Parameters>
