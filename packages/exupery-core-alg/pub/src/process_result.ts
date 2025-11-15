import * as _et from 'exupery-core-types'


export const create_process_result = <Data, Error>(
    $: Data
): _et.Process_Result<Data, Error> => {
    return {
        'transform': (
            transformer
        ) => {
            return create_process_result(transformer($))
        },
        'transform with parameters': (
            transformer,
            parameters
        ) => {
            return create_process_result(transformer($, parameters))
        },
        'refine': (
            refiner,
            map_error
        ) => {
            return refiner($).transform(
                ($) => create_process_result($),
                ($) => create_process_error(map_error($))
            )
        },
        'refine with parameters': (
            refiner,
            parameters,
            map_error
        ) => {
            return refiner($, parameters).transform(
                ($) => create_process_result($),
                ($) => create_process_error(map_error($))
            )
        },
        '__extract_data': (
            success,
            error
        ) => {
            success($)
        }
    }
}

export const create_process_error = <Data, Error>(
    $: Error
): _et.Process_Result<Data, Error> => {
    return {
        'transform': (
        ) => {
            return create_process_error($)
        },
        'transform with parameters': (
        ) => {
            return create_process_error($)
        },
        'refine': (
        ) => {
            return create_process_error($)
        },
        'refine with parameters': (
        ) => {
            return create_process_error($)
        },
        '__extract_data': (
            success,
            error
        ) => {
            error($)
        }
    }
}