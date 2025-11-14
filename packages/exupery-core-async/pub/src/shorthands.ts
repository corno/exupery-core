import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { Basic_Query_Promise } from "./types/Basic_Query"
import { __create_procedure_promise } from "./algorithms/procedure/create_procedure_promise"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"
import { Error_Handler } from "./types/Error_Handler"
export namespace p {

    /**
     * 
     * @param action upi
     * @param query u.q
     */
    export const action = <Error, Parameters, Resources>(
        action: _et.Procedure<Parameters, Error, Resources>,
        query: Basic_Query_Promise<Parameters, Error>,
        resources: Resources,
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                //run the query
                query.__start(
                    (query_result) => {
                        //run the action
                        action(resources)['execute with synchrounous data'](query_result).__start(
                            on_success,
                            (error) => {
                                //transform the error
                                on_error(error)
                            }
                        )
                    },
                    on_error,
                )
            }
        })
    }

    /**
     * 
     * @param steps up[]
     * @returns 
     */
    export const sequence = <Error>(
        steps: _et.Procedure_Promise<Error>[]
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const length = _ei.array_literal(steps).__get_number_of_elements()
                const runStep = (index: number) => {
                    if (index >= length) {
                        on_success()
                        return
                    }
                    steps[index].__start(
                        () => runStep(index + 1),
                        on_error,
                    )
                }
                runStep(0)
            }
        })
    }

    /**
     * 
     * @param the_array up[]
     * @param aggregate_exceptions gt
     * @returns 
     */
    export const array = <Error, Element_Error>(
        the_array: _et.Array<_et.Procedure_Promise<Element_Error>>,
        aggregate_exceptions: _et.Transformer_Without_Parameters<_et.Array<Element_Error>, Error>,

    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const exceptions: Element_Error[] = []

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        the_array.map(($) => {
                            monitor['report process started']()

                            $.__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    exceptions.push(e)
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        if (exceptions.length === 0) {
                            on_success()
                        } else {
                            on_error(aggregate_exceptions(_ei.array_literal(exceptions)))
                        }
                    }
                )
            }
        })
    }

    /**
     * 
     * @param the_dictionary dict<up>
     * @param aggregate_exceptions gt
     * @returns 
     */
    export const dictionary = <Error, Element_Error>(
        the_dictionary: _et.Dictionary<_et.Procedure_Promise<Element_Error>>,
        aggregate_exceptions: _et.Transformer_Without_Parameters<_et.Dictionary<Element_Error>, Error>,
    ): _et.Procedure_Promise<Error> => {
        return __create_procedure_promise({
            'execute': (
                on_success,
                on_error,
            ) => {

                const exceptions: { [key: string]: Element_Error } = {}

                create_asynchronous_processes_monitor(
                    (monitor) => {
                        the_dictionary.map(($, key) => {
                            monitor['report process started']()

                            $.__start(
                                () => {
                                    monitor['report process finished']()
                                },
                                (e) => {
                                    exceptions[key] = e
                                    monitor['report process finished']()
                                }
                            )
                        })
                    },
                    () => {
                        if (Object.keys(exceptions).length === 0) {
                            on_success()
                        } else {
                            on_error(aggregate_exceptions(_ei.dictionary_literal(exceptions)))
                        }
                    }
                )
            }
        })
    }

}

export namespace q {

    /**
     * 
     * @param query_result qr
     * @returns 
     */
    export const fixed = <Query_Result, Error>(
        query_result: Query_Result,
    ): Basic_Query_Promise<Query_Result, Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                on_success(query_result)
            }
        }
    }

    /**
     * query
     * @param the_query uqi
     * @param parameters u.q
     * @param result_refinement ut
     * @param error_transform gt
     * @param error_handler eh
     * @returns 
     */
    export const u = <Result_After_Transformation, Error, Parameters, Query_Result, Query_Error, Resources>(
        the_query: _et.Query<Parameters, Query_Result, Query_Error, Resources>,
        parameters: Basic_Query_Promise<Parameters, Error>,
        resources: Resources,
        result_refinement: _et.Refiner_Without_Parameters<Query_Result, Result_After_Transformation, Error>,
        error_transform: _et.Transformer_Without_Parameters<Query_Error, Error>,
        error_handler?: Error_Handler<Query_Error>,
    ): Basic_Query_Promise<Result_After_Transformation, Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                parameters.__start(
                    (qr_in) => {
                        the_query(resources)(qr_in).__start(
                            (result) => {
                                result_refinement(result).process(
                                    (x) => on_success(x),
                                    on_error,
                                )
                            },
                            (error) => {
                                if (error_handler !== undefined) {
                                    error_handler(error)
                                }
                                on_error(error_transform(error))
                            },
                        )

                    },
                    on_error
                )
            }
        }
    }


}

export namespace t {

    /**
     * 
     * @param the_refinement ut
     * @param error_transform  gt
     * @param error_handler  eh
     * @returns 
     */
    export const u = <In, Out, Error, Transformation_Error>(
        the_refinement: _et.Refiner_Without_Parameters<In, Out, Transformation_Error>,
        error_transform: _et.Transformer_Without_Parameters<Transformation_Error, Error>,
        error_handler?: Error_Handler<Transformation_Error>,
    ): _et.Refiner_Without_Parameters<In, Out, Error> => {
        return ($: In) => {
            const result = the_refinement($)
            return result.map(
                (out) => out,
                (transformation_error) => {
                    //run the error handler
                    if (error_handler !== undefined) {
                        error_handler(transformation_error)
                    }
                    return error_transform(transformation_error)
                }
            )
        }
    }

    /**
     * 
     * @param the_transformation gt
     */
    export const g = <In, Out, Error>(
        the_transformation: _et.Transformer_Without_Parameters<In, Out>,
    ): _et.Refiner_Without_Parameters<In, Out, Error> => {
        return ($: In) => {
            return _ei.refinement.successful(the_transformation($))
        }
    }

}