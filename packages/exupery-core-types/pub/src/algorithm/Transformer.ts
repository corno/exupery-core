
export type Transformer_New_With_Parameters<Input, Result, Parameters> = (
    $: Input,
    $p: Parameters,
) => Result

export type Transformer_New<Input, Result> = (
    $: Input,
) => Result

