import { Query_Promise } from "./Query"

export type Procedure<Parameters, Error, Resources> = ($r: Resources) => Procedure_Primed_With_Resources<Parameters, Error>

export type Procedure_Primed_With_Resources<Parameters, Error> = {
    'execute with synchronous data': (
        parameters: Parameters
    ) => Procedure_Promise<Error>

    'execute with synchronous data and map error': <New_Error>(
        parameters: Parameters,
        map_error: (error: Error) => New_Error,
    ) => Procedure_Promise<New_Error>
    
    'execute with asynchronous data': (
        query: Query_Promise<Parameters, Error>
    ) => Procedure_Promise<Error>
    
    'execute with asynchronous data and map error': <New_Error>(
        query: Query_Promise<Parameters, Error>,
        map_error: (error: Error) => New_Error,
    ) => Procedure_Promise<New_Error>
}

export type Procedure_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void

    map_error<NE>(
        handle_error: (error: Error) => NE
    ): Procedure_Promise<NE>
}