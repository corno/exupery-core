import { Data_Preparation_Result } from "./Data_Preparation_Result"

export type Command_Procedure<Parameters, Error, Query_Resources, Command_Resources> = ($q: Query_Resources, $c: Command_Resources) => Command<Parameters, Error>

export type Command<Parameters, Error> = {
    //these are actions, and should ideally be written like execute.direct(Command, transform_error, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(transform_error, parameters)
    'execute': <Target_Error>(
            parameters: Parameters,
            transform_error: (error: Error) => Target_Error,
        ) => Command_Promise<Target_Error>,
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}