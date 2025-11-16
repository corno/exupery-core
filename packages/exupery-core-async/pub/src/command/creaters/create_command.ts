import * as _et from 'exupery-core-types'
import { __create_command_promise } from './create_command_promise'

export type Basic_Command<Parameters, Error> = ($: Parameters) => _et.Command_Promise<Error>

export const __create_command = <Parameters, Error, Resources>(
    handler: Basic_Command<Parameters, Error>,
): _et.Command<Parameters, Error> => {
    return {

        'execute': {
            'direct': (transform_error, parameters) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {
                        handler(parameters).__start(
                            on_success,
                            (error) => {
                                on_error(
                                    transform_error(error)
                                )
                            }
                        )
                    }
                })
            },

            'query': (transform_error, query) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {
                        query.__start(
                            ($) => {
                                handler($).__start(
                                    on_success,
                                    (error) => {
                                        on_error(
                                            transform_error(error)
                                        )
                                    }
                                )
                            },
                            (error) => {
                                on_error(
                                    transform_error(error)
                                )
                            },
                        )
                    }
                })
            },



            'refiner': (transform_error, refiner) => {
                return __create_command_promise({
                    'execute': (on_success, on_error) => {
                        refiner.process(
                            ($) => {
                                handler($).__start(
                                    on_success,
                                    (error) => {
                                        on_error(
                                            transform_error(error)
                                        )
                                    }
                                )
                            },
                            (error) => {
                                on_error(
                                    transform_error(error)
                                )
                            },
                        )
                    }
                })
            }

        },
    }
}