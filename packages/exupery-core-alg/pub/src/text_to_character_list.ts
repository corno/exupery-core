import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-internals'

export const text_to_character_list = ($: string): _et.Array<number> => {
    const out: number[] = []
    for (let i = 0; i < $.length; i++) {
        out.push($.charCodeAt(i))
    }
    return _ea.array_literal(out)
}