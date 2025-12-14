import * as _et from 'exupery-core-types'

export const create_iterator = <Element>($: _et.List<Element>): _et.Iterator<Element> => {
    let position = 0

    return {
        'consume': () => {
            position += 1
        },
        'get current': () => {
            return $.__get_element_at(position)
        },
        'look ahead': (offset: number) => {
            return $.__get_element_at(position + offset)
        },
        'get position': () => {
            return position
        }
    }
}