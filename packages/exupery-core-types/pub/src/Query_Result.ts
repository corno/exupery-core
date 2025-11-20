import { Transformer } from "./Transformer"

//Shoutout to Reinout for helping me with the naming here :)

type Stager<Output, Error, Input> = (
    $: Input,
) => Query_Result<Output, Error>

export interface Query_Result<Output, Error> {
    query_result: null

    transform_result<New_Output>(
        transformer: Transformer<New_Output, Output>
    ): Query_Result<New_Output, Error>

    transform_error_temp<New_Error>(
        error_transformer: Transformer<New_Error, Error>,
    ): Query_Result<Output, New_Error>

    query_without_error_transformation<New_Output>(
        query: Stager<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>
    
    query<New_Output, Stager_Error>(
        query: Stager<New_Output, Stager_Error, Output>,
        /**
         * if the stager fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Stager_Error>,
    ): Query_Result<New_Output, Error>

    refine_without_error_transformation<New_Output>(
        refiner: Stager<New_Output, Error, Output>
    ): Query_Result<New_Output, Error>
    
    refine<New_Output, Stager_Error>(
        refiner: Stager<New_Output, Stager_Error, Output>,
        /**
         * if the stager fails, rework its error into the desired error type
         */
        error_transformer: Transformer<Error, Stager_Error>,
    ): Query_Result<New_Output, Error>

    rework_error_temp<New_Error, Rework_Error>(
        error_reworker: Stager<New_Error, Rework_Error, Error>,
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

