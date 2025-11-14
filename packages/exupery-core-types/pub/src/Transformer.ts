
export type Transformer_With_Parameters<In, Parameters, Out> = (
    $: In,
    $p: Parameters,
) => Out

export type Transformer_Without_Parameters<In, Out> = (
    $: In,
) => Out

