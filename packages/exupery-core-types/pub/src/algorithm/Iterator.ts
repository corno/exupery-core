import { Optional_Value } from "../data/Optional_Value"

export type Iterator<Element, State> = {
    'get current': () => Optional_Value<Element>,
    'look ahead': (offset: number) => Optional_Value<Element>
    'consume': () => void,
    'get state': () => State,
}