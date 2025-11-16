import * as _et from 'exupery-core-types'
import { dictionary_literal } from './dictionary_literal'
import { array_literal } from './array_literal'

export type Procedural_Dictionary_Builder<Entry> = {
    'add entry': (key: string, entry: Entry) => void,
    'get dictionary': () => _et.Dictionary<Entry>,
}

export const create_procedural_dictionary_builder = <Entry>(): Procedural_Dictionary_Builder<Entry> => {
    const entries: { [key: string]: Entry } = {}

    return {
        'add entry': (key: string, entry: Entry) => {
            entries[key] = entry
        },

        'get dictionary': () => {
            return dictionary_literal(entries)
        },
    }
}

export type Procedural_List_Builder<Item> = {
    'add item': (item: Item) => void,
    'get list': () => _et.Array<Item>,
}

export const create_procedural_list_builder = <Item>(): Procedural_List_Builder<Item> => {
    const items: Item[] = []

    return {
        'add item': (item: Item) => {
            items.push(item)
        },

        'get list': () => {
            return array_literal(items)
        },
    }
}