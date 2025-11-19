
export type Transformer_With_Parameters<Out, In, Parameters> = (
    $: In,
    $p: Parameters,
) => Out

export type Transformer<Out, In> = (
    $: In,
) => Out

