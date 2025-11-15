import { Query_Promise } from "./Query"

export type Procedure<Parameters, Error, Resources> = ($r: Resources) => Procedure_Primed_With_Resources<Parameters, Error>

export type Procedure_Primed_With_Resources<Parameters, Error> = {
    'execute with synchronous data': ($: Parameters) => Procedure_Promise<Error>
    'execute with asynchronous data': (query: Query_Promise<Parameters, Error>) => Procedure_Promise<Error>
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