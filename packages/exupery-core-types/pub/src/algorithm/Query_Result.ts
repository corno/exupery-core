import { Queryer } from "./Queryer"
import { Refiner } from "./Refiner"
import { Transformer } from "./Transformer"

//Shoutout to Reinout for helping me with the naming here :)

export interface Query_Result<Output, Error> {
    query_result: null

    transform_result<New_Output>(
        transformer: Transformer<New_Output, Output>
    ): Query_Result<New_Output, Error>

    deprecated_transform_error<New_Error>(
        error_transformer: Transformer<New_Error, Error>,
    ): Query_Result<Output, New_Error>

    query_without_error_transformation<New_Output>(
        query: Queryer<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>
    
    query<New_Output, Query_Error>(
        query: Queryer<New_Output, Query_Error, Output>,
        /**
         * if the query fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Query_Error>,
    ): Query_Result<New_Output, Error>

    refine_without_error_transformation<New_Output>(
        refiner: Refiner<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>
    
    refine<New_Output, Refiner_Error>(
        refiner: Refiner<New_Output, Refiner_Error, Output>,
        /**
         * if the refiner fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Refiner_Error>,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Queryer<New_Error, Rework_Error, Error>,
        /**
         * if the reworker fails, we need to transform *that* error into the New_Error
         */
        rework_error_transformer: Transformer<New_Error, Rework_Error>,
    ): Query_Result<Output, New_Error>

    __extract_data: (
        on_success: ($: Output) => void,
        on_error: ($: Error) => void
    ) => void

}

