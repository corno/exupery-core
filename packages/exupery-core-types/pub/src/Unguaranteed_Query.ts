
import { Guaranteed_Query_Promise } from "./Guaranteed_Query"


export type Unguaranteed_Query<Parameters, Result, Error, Resources> = ($: Parameters, $r: Resources) => Unguaranteed_Query_Promise<Result, Error>

export type Unguaranteed_Query_Promise<Result, Error> = {
    map_<NT>(
        handle_value: ($: Result) => NT
    ): Unguaranteed_Query_Promise<NT, Error>

    map_exception_<NE>(
        handle_exception: ($: Error) => NE
    ): Unguaranteed_Query_Promise<Result, NE>

    then<NT>(
        handle_value: ($: Result) => Guaranteed_Query_Promise<NT>
    ): Unguaranteed_Query_Promise<NT, Error>

    then_unguaranteed<NT>(
        handle_value: ($: Result) => Unguaranteed_Query_Promise<NT, Error>
    ): Unguaranteed_Query_Promise<NT, Error>

    catch_(
        handle_exception: ($: Error) => Guaranteed_Query_Promise<Result>
    ): Guaranteed_Query_Promise<Result>

    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}

export type Basic_Unguaranteed_Query_Promise<Result, Error> = {
    __start: (
        on_success: (result: Result) => void,
        on_error: (error: Error) => void,
    ) => void
}