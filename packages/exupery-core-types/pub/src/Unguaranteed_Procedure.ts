
export type Unguaranteed_Procedure<Parameters, Error, Resources> = ($r: Resources) => Unguaranteed_Procedure_Primed_With_Resources<Parameters, Error>

export type Unguaranteed_Procedure_Primed_With_Resources<Parameters, Error> = ($: Parameters) => Unguaranteed_Procedure_Promise<Error>

export type Unguaranteed_Procedure_Promise<Error> = {
    __start: (
        on_success: () => void,
        on_error: (error: Error) => void,
    ) => void

    map_error<NE>(
        handle_error: (error: Error) => NE
    ): Unguaranteed_Procedure_Promise<NE>
}