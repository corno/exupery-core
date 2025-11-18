import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-internals'

export const text_to_character_list = ($: string): _et.List<number> => {
    const out: number[] = []
    for (let i = 0; i < $.length; i++) {
        out.push($.charCodeAt(i))
    }
    return _ea.list_literal(out)
}