
export type Procedure<Parameters, Error, Resources> = ($r: Resources) => Procedure_Primed_With_Resources<Parameters, Error>

export type Procedure_Primed_With_Resources<Parameters, Error> = ($: Parameters) => Procedure_Promise<Error>

export type Procedure_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void

    map_error<NE>(
        handle_error: (error: Error) => NE
    ): Procedure_Promise<NE>
}