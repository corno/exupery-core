import { Refinement_Result } from "./Refinement_Result";

export type Refiner<Output, Error, Input> = (
    $: Input,
) => Refinement_Result<Output, Error>