import { Refiner, Refiner_With_Parameters } from "./Refiner"

export type Deserializer_With_Parameters<Result, Error, Parameters> = Refiner_With_Parameters<Result, Error, string, Parameters>


export type Deserializer<Result, Error> = Refiner<Result, Error, string>