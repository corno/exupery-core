import { Data_Preparation_Result } from "./Data_Preparation_Result"

export type Command_Procedure<Parameters, Error, Resources> = ($r: Resources) => Command<Parameters, Error>

export type Command<Parameters, Error> = {
    //these are actions, and should ideally be written like execute.direct(Command, transform_error, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(transform_error, parameters)
    'execute': {

        'direct': <Target_Error>(
            transform_error: (error: Error) => Target_Error,
            parameters: Parameters,

        ) => Command_Promise<Target_Error>,

        'prepare': <Target_Error>(
            transform_error: (error: Error) => Target_Error,
            query: Data_Preparation_Result<Parameters, Target_Error>,
        ) => Command_Promise<Target_Error>,

    }
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}