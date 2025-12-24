import { Transformer, Transformer_With_Parameters } from "./Transformer"

export type Serializer_With_Parameters<Input, Parameters> = Transformer_With_Parameters<Input, string, Parameters>

export type Serializer<Input> = Transformer<Input, string>
