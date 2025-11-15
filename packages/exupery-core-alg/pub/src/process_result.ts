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
                ($) => create_failed_process_result(map_error($))
            )
        },
        'refine with parameters': (
            refiner,
            parameters,
            map_error
        ) => {
            return refiner($, parameters).transform(
                ($) => create_process_result($),
                ($) => create_failed_process_result(map_error($))
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

export const create_failed_process_result = <Data, Error>(
    $: Error
): _et.Process_Result<Data, Error> => {
    return {
        'transform': (
        ) => {
            return create_failed_process_result($)
        },
        'transform with parameters': (
        ) => {
            return create_failed_process_result($)
        },
        'refine': (
        ) => {
            return create_failed_process_result($)
        },
        'refine with parameters': (
        ) => {
            return create_failed_process_result($)
        },
        '__extract_data': (
            success,
            error
        ) => {
            error($)
        }
    }
}