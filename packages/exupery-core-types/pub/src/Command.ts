import { Staging_Result } from "./Staging_Result"

export type Command_Procedure<Error, Parameters, Command_Resources, Query_Resources> = ($c: Command_Resources, $q: Query_Resources) => Command<Error, Parameters>

export type Command<Error, Parameters> = {
    //these are actions, and should ideally be written like execute.direct(Command, transform_error, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(transform_error, parameters)
    'execute': <Execution_Error>(
            parameters: Parameters,
            transform_error: (error: Error) => Execution_Error,
        ) => Command_Promise<Execution_Error>,
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}