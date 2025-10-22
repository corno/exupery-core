import { Value } from "./types/instance"

export const parse_json = (json: string): Value => {
    return JSON.parse(json)
}