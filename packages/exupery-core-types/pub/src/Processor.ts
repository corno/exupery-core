import { Process_Result } from "./Process_Result";

export type Processor<Input, Output, Error> = (
    $: Input,
) => Process_Result<Output, Error>
