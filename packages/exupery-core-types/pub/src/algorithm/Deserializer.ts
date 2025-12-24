
export type Refiner_With_Parameters<Result, Error, Input, Parameters> = (
    $: Input,
    $p: Parameters,
    abort: ($: Error) => never
) => Result


export type Refiner<Result, Error, Input> = (
    $: Input,
    abort: ($: Error) => never
) => Result