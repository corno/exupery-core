
export type Transformer_With_Parameters<Out, In, Parameters> = (
    $: In,
    $p: Parameters,
) => Out

export type Transformer_Without_Parameters<Out, In> = (
    $: In,
) => Out

