import { Refinement_Result } from "./Refinement_Result";

export type Refiner_Old<Result, Error, Input> = (
    $: Input,
) => Refinement_Result<Result, Error>


export type Refiner_With_Parameters<Result, Error, Input, Parameters> = (
    $: Input,
    $p: Parameters,
    abort: ($: Error) => never
) => Result


export type Refiner_New<Result, Error, Input> = (
    $: Input,
    abort: ($: Error) => never
) => Result