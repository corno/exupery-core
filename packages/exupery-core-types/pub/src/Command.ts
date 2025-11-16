import { Query_Promise } from "./Query"
import { Refinement_Result } from "./Refiner"

export type Command_Procedure<Parameters, Error, Resources> = ($r: Resources) => Command<Parameters, Error>

export type Command<Parameters, Error> = {
    //these are actions, and should ideally be written like execute.direct(Command, transform_error, parameters)
    // but TypeScript does a way better job inferring types this way, so it will be Command.execute.direct(transform_error, parameters)
    'execute': {

        'direct': <New_Error>(
            transform_error: (error: Error) => New_Error,
            parameters: Parameters,

        ) => Command_Promise<New_Error>,

        'query': <New_Error>(
            transform_error: (error: Error) => New_Error,
            query: Query_Promise<Parameters, New_Error>,
        ) => Command_Promise<New_Error>,

        'refiner': <New_Error>(
            transform_error: (error: Error) => New_Error,
            refiner: Refinement_Result<Parameters, New_Error>
        ) => Command_Promise<New_Error>,

    }
}

export type Command_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void
}