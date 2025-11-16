
export interface Data_Preparation_Result<Output, Error> {
    __extract_data: (
        success: ($: Output) => void,
        error: ($: Error) => void
    ) => void
}


    // query_with_result<New_Result>(
    //     query: Query<Result, New_Result, Error>
    // ): Query_Promise<New_Result, Error>

    // rework_error_with_new_query<Target_Error, Rework_Query_Error>(
    //     query: Query<Error, Target_Error, Rework_Query_Error>,
    //     transform_rework_error: (error: Rework_Query_Error) => Target_Error,
    // ): Query_Promise<Result, Target_Error>

    // query<New_Result, Target_Error>(queries: {
    //     'result': Query<Result, New_Result, Target_Error>,
    //     'error': Query<Error, New_Result, Target_Error>,
    // }): Query_Promise<New_Result, Target_Error>



    // process_result<New_Result>(
    //     processor: Processor<Result, New_Result, Error>
    // ): Query_Promise<New_Result, Error>

    // process_error<Target_Error>(
    //     processor: Processor<Error, Result, Target_Error>
    // ): Query_Promise<Result, Target_Error>

    // process<New_Result, Target_Error>($: {
    //     'result': Processor<Result, New_Result, Target_Error>,
    //     'error': Processor<Error, New_Result, Target_Error>,
    // }): Query_Promise<New_Result, Target_Error>



    // transform_result<New_Result>(
    //     transformer: (Transformer_Without_Parameters<Result, New_Result>)
    // ): Query_Promise<New_Result, Error>

    // transform_error<Target_Error>(
    //     transformer: Transformer_Without_Parameters<Error, Target_Error>
    // ): Query_Promise<Result, Target_Error>

    // transform<New_Result, Target_Error>($: {
    //     'result': Transformer_Without_Parameters<Result, New_Result>,
    //     'error': Transformer_Without_Parameters<Error, Target_Error>,
    // }): Query_Promise<New_Result, Target_Error>



    // __start(
    //     on_success: ($: Result) => void,
    //     on_error: ($: Error) => void
    // ): void

//     export interface Process_Result<Output, Error> {

//     'transform': <New_Output>(
//         transformer: Transformer_Without_Parameters<Output, New_Output>
//     ) => Process_Result<New_Output, Error>

//     'transform error': <Target_Error>(
//         transformer: Transformer_Without_Parameters<Error, Target_Error>
//     ) => Process_Result<Output, Target_Error>

//     'transform with parameters': <New_Output, Parameters>(
//         transformer: Transformer_With_Parameters<Output, Parameters, New_Output>,
//         parameters: Parameters
//     ) => Process_Result<New_Output, Error>

//     'refine': <New_Output, Refine_Error>(
//         refiner: Refiner_Without_Parameters<Output, New_Output, Refine_Error>,
//         map_error: ($: Refine_Error) => Error
//     ) => Process_Result<New_Output, Error>

//     'refine with parameters': <New_Output, Parameters, Refine_Error>(
//         refiner: Refiner_With_Parameters<Output, Parameters, New_Output, Refine_Error>,
//         parameters: Parameters,
//         map_error: ($: Refine_Error) => Error
//     ) => Process_Result<New_Output, Error>

//     __extract_data: (
//         success: ($: Output) => void,
//         error: ($: Error) => void
//     ) => void
// }

// export interface Refinement_Result<T, E> {
//     /**
//      * @param set what to do when the value was set, returns the new type
//      * @param not_set  what to do when the value was not set, returns the new type
//      */
//     process(
//         success: ($: T) => void,
//         error: ($: E) => void,
//     ): void

//     map<NT, NE>(
//         handle_value: ($: T) => NT,
//         handle_error: ($: E) => NE
//     ): Refinement_Result<NT, NE>

//     map_result<NT>(
//         handle_value: ($: T) => NT,
//     ): Refinement_Result<NT, E>

//     transform<NT>(
//         handle_value: ($: T) => NT,
//         handle_error: ($: E) => NT
//     ): NT

//     transform_error<NE>(
//         handle_error: ($: E) => NE
//     ): Refinement_Result<T, NE>

//     with_result<NT>(
//         handle_value: ($: T) => Refinement_Result<NT, E>,
//     ): Refinement_Result<NT, E>
// }
