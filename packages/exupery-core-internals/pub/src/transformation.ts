import * as _et from 'exupery-core-types'

export type Transformation_With_Parameters<In, Parameters, Out> = (
    $: In,
    $p: Parameters,
) => Out

export type Transformation_Without_Parameters<In, Out> = (
    $: In,
) => Out

