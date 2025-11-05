import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { _Unguaranteed_Query, Unguaranteed } from "./types/Unguaranteed_Query"
import { _Guaranteed_Query, Guaranteed } from "./types/Guaranteed_Query"
import { Guaranteed_Procedure, Guaranteed_Procedure_Initializer } from "./types/Guaranteed_Procedure"
import { Unguaranteed_Procedure_Initializer, Unguaranteed_Procedure } from "./types/Unguaranteed_Procedure"
import { __create_unguaranteed_procedure } from "./algorithms/procedure/initialize_unguaranteed_procedure"
import { __create_guaranted_procedure } from "./algorithms/procedure/initialize_guaranteed_procedure"
import { Unguaranteed_Query_Initializer } from "./types/Unguaranteed_Query"
import { Guaranteed_Query_Initializer } from "./types/Guaranteed_Query"
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"
import { Error_Handler } from "./types/Error_Handler"

/**
 * 
 * @param action gpi
 * @param error_transform gt
 */
export const eh = <Parameters, Error>(
    action: Guaranteed_Procedure_Initializer<Parameters>,
    error_transform: _ei.Transformation_Without_Parameters<Error, Parameters>,

): Error_Handler<Error> => {
    return ($: Error) => {
        action(error_transform($)).__start(() => { })
    }
}

export namespace gp {

    /**
     * 
     * @param action gpi
     * @param query g.q
     * @returns 
     */
    export const action = <Parameters>(
        action: Guaranteed_Procedure_Initializer<Parameters>,
        query: Guaranteed.Query_<Parameters>,
    ): Guaranteed_Procedure => {
        return {
            __start: (
                on_finished,
            ) => {
                //run the query
                query.__start(
                    (query_result) => {
                        //run the action
                        action(query_result).__start(
                            on_finished
                        )
                    },
                )
            }
        }
    }

}

export namespace gq {

    /**
     * 
     * @param query_result qr
     * @returns 
     */
    export const fixed = <Query_Result>(
        query_result: Query_Result,
    ): Guaranteed.Query_<Query_Result> => {
        return {
            __start: (
                on_finished,
            ) => {
                on_finished(query_result)
            }
        }
    }

    /**
     * 
     * @param the_query gqi
     * @param parameters g.q
     * @param result_transformation gt
     * @returns 
     */
    export const g = <Result_After_Transformation, Parameters, Query_Result>(
        the_query: Guaranteed_Query_Initializer<Parameters, Query_Result>,
        parameters: Guaranteed.Query_<Parameters>,
        result_transformation: _ei.Transformation_Without_Parameters<Query_Result, Result_After_Transformation>,
    ): Guaranteed.Query_<Result_After_Transformation> => {
        return {
            __start: (
                on_finished,
            ) => {
                parameters.__start(
                    (qr_in) => {
                        the_query(qr_in).__start(
                            (result) => {
                                on_finished(result_transformation(result))
                            },
                        )

                    }
                )
            }
        }
    }

}

export namespace gt {

    /**
     * 
     * @param the_transformation gt
     * @returns 
     */
    export const g = <In, Out>(
        the_transformation: _ei.Transformation_Without_Parameters<In, Out>,
    ): _ei.Transformation_Without_Parameters<In, Out> => {
        return ($: In) => the_transformation($)
    }

}

export namespace up {

    /**
     * 
     * @param action upi
     * @param query u.q
     */
    export const action = <Error, Parameters>(
        action: Unguaranteed_Procedure_Initializer<Parameters, Error>,
        query: Unguaranteed.Query<Parameters, Error>,
    ): Unguaranteed_Procedure<Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                //run the query
                query.__start(
                    (query_result) => {
                        //run the action
                        action(query_result).__start(
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
        }
    }

    /**
     * 
     * @param steps up[]
     * @returns 
     */
    export const sequence = <Error>(
        steps: Unguaranteed_Procedure<Error>[]
    ): Unguaranteed_Procedure<Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                const length = _ei.array_literal(steps).__get_length()
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
        }
    }

    /**
     * 
     * @param the_array up[]
     * @param aggregate_exceptions gt
     * @returns 
     */
    export const array = <Error, Element_Error>(
        the_array: _et.Array<Unguaranteed_Procedure<Element_Error>>,
        aggregate_exceptions: _ei.Transformation_Without_Parameters<_et.Array<Element_Error>, Error>,

    ): Unguaranteed_Procedure<Error> => {
        return {
            __start: (
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
        }
    }

    /**
     * 
     * @param the_dictionary dict<up>
     * @param aggregate_exceptions gt
     * @returns 
     */
    export const dictionary = <Error, Element_Error>(
        the_dictionary: _et.Dictionary<Unguaranteed_Procedure<Element_Error>>,
        aggregate_exceptions: _ei.Transformation_Without_Parameters<_et.Dictionary<Element_Error>, Error>,
    ): Unguaranteed_Procedure<Error> => {
        return {
            __start: (
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
        }
    }

}

export namespace upi {

    /**
     * 
     * @param action gpi
     */
    export const g = <Parameters, Error>(
        action: Guaranteed_Procedure_Initializer<Parameters>,
    ): Unguaranteed_Procedure_Initializer<Parameters, Error> => ($: Parameters) => {
        return __create_unguaranteed_procedure({
            'execute': (
                on_succes,
                on_error,
            ) => {
                action($).__start(on_succes)
            }
        })
    }

    /**
     * 
     * @param action upi
     */
    export const u = <Parameters, Error, Action_Error>(
        action: Unguaranteed_Procedure_Initializer<Parameters, Action_Error>,
        error_transform: _ei.Transformation_Without_Parameters<Action_Error, Error>,
        error_handler?: Error_Handler<Action_Error>,
    ): Unguaranteed_Procedure_Initializer<Parameters, Error> => ($: Parameters) => {
        return __create_unguaranteed_procedure({
            'execute': (
                on_succes,
                on_error,
            ) => {
                action($).__start(
                    on_succes,
                    (error) => {
                        if (error_handler !== undefined) {
                            error_handler(error)
                        }
                        on_error(error_transform(error))
                    }
                )
            }
        })
    }

}

export namespace uq {

    /**
     * 
     * @param query_result qr
     * @returns 
     */
    export const fixed = <Query_Result, Error>(
        query_result: Query_Result,
    ): Unguaranteed.Query<Query_Result, Error> => {
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
     * unguaranteed query
     * @param the_query uqi
     * @param parameters u.q
     * @param result_refinement ut
     * @param error_transform gt
     * @param error_handler eh
     * @returns 
     */
    export const u = <Result_After_Transformation, Error, Parameters, Query_Result, Query_Error>(
        the_query: Unguaranteed_Query_Initializer<Parameters, Query_Result, Query_Error>,
        parameters: Unguaranteed.Query<Parameters, Error>,
        result_refinement: _ei.Refinement_Without_Parameters<Query_Result, Result_After_Transformation, Error>,
        error_transform: _ei.Transformation_Without_Parameters<Query_Error, Error>,
        error_handler?: Error_Handler<Query_Error>,
    ): Unguaranteed.Query<Result_After_Transformation, Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                parameters.__start(
                    (qr_in) => {
                        the_query(qr_in).__start(
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

    /**
     * guaranteed query
     * @param the_query gqi
     * @param parameters u.q
     * @param result_refinement ut
     */
    export const g = <Result_After_Transformation, Error, Parameters, Query_Result>(
        the_query: Guaranteed_Query_Initializer<Parameters, Query_Result>,
        parameters: Unguaranteed.Query<Parameters, Error>,
        result_refinement: _ei.Refinement_Without_Parameters<Query_Result, Result_After_Transformation, Error>,

    ): Unguaranteed.Query<Result_After_Transformation, Error> => {
        return {
            __start: (
                on_success,
                on_error,
            ) => {
                parameters.__start(
                    (x) => {
                        the_query(x).__start(
                            ($) => {
                                result_refinement($).process(
                                    (x) => on_success(x),
                                    on_error,
                                )
                            },
                        )
                    },
                    on_error,
                )
            }
        }
    }

}

export namespace ut {

    /**
     * 
     * @param the_refinement ut
     * @param error_transform  gt
     * @param error_handler  eh
     * @returns 
     */
    export const u = <In, Out, Error, Transformation_Error>(
        the_refinement: _ei.Refinement_Without_Parameters<In, Out, Transformation_Error>,
        error_transform: _ei.Transformation_Without_Parameters<Transformation_Error, Error>,
        error_handler?: Error_Handler<Transformation_Error>,
    ): _ei.Refinement_Without_Parameters<In, Out, Error> => {
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
        the_transformation: _ei.Transformation_Without_Parameters<In, Out>,
    ): _ei.Refinement_Without_Parameters<In, Out, Error> => {
        return ($: In) => {
            return _ei.refinement.successful(the_transformation($))
        }
    }

}