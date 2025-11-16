import { Query_Promise } from "./Query"

export type Command_Procedure<Parameters, Error, Resources> = ($r: Resources) => Command<Parameters, Error>

export type Command<Parameters, Error> = {
    'execute with synchronous data without error transformation': (
        parameters: Parameters
    ) => Comand_Promise<Error>

    'execute with synchronous data': <New_Error>(
        parameters: Parameters,
        transform_error: (error: Error) => New_Error,
    ) => Comand_Promise<New_Error>
    
    'execute with asynchronous data without error transformation': (
        query: Query_Promise<Parameters, Error>
    ) => Comand_Promise<Error>
    
    'execute with asynchronous data': <New_Error>(
        query: Query_Promise<Parameters, Error>,
        transform_error: (error: Error) => New_Error,
    ) => Comand_Promise<New_Error>
}

export type Comand_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void

    map_error<NE>(
        handle_error: (error: Error) => NE
    ): Comand_Promise<NE>
}