import * as _ei from 'exupery-core-internals'

import { Unguaranteed_Query_Result } from "./query/Unguaranteed_Query_Result"
import { Guaranteed_Query_Result } from "./query/Guaranteed_Query_Result"
import { Guaranteed_Action } from "./procedure/Guaranteed_Procedure_Context"
import { Unguaranteed_Action } from "./procedure/Unguaranteed_Procedure_Context"
import { __execute_unguaranteed_action } from "./procedure/initialize_unguaranteed_procedure_context"
import { __execute_guaranteed_action } from "./procedure/initialize_guaranteed_procedure_context"
import { Unguaranteed_Query } from './query/Unguaranteed_Query'
import { Guaranteed_Query } from './query/Guaranteed_Query'

export type Error_Handler<Error> = (error: Error) => void


export type Guaranteed_Transformation_With_Parameters<In, Parameters, Out> = (
    $: In,
    $p: Parameters,
) => Out

export type Guaranteed_Transformation_Without_Parameters<In, Out> = (
    $: In,
) => Out

export type Unguaranteed_Transformation_With_Parameters<In, Parameters, Out, Error> = (
    $: In,
    $p: Parameters,
) => _ei.Unguaranteed_Transformation_Result<Out, Error>

export type Unguaranteed_Transformation_Without_Parameters<In, Out, Error> = (
    $: In,
) => _ei.Unguaranteed_Transformation_Result<Out, Error>


export namespace Unguaranteed {

    export type Procedure<Error> = {
        __start: (
            on_success: () => void,
            on_error: (error: Error) => void,
        ) => void
    }

    export type Query<Result, Error> = {
        __start: (
            on_success: (result: Result) => void,
            on_error: (error: Error) => void,
        ) => void
    }

}

export namespace Guaranteed {

    export type Procedure = {
        __start: (
            on_finished: () => void,
        ) => void
    }

    export type Query<Result> = {
        __start: (
            on_finished: (result: Result) => void,
        ) => void
    }

}

export namespace ut {

    export const u = <In, Out, Error>(
        the_transformation: Unguaranteed_Transformation_Without_Parameters<In, Out, Error>,
    ): Unguaranteed_Transformation_Without_Parameters<In, Out, Error> => {
        return the_transformation
    }

    export const g = <In, Out, Error>(
        the_transformation: Guaranteed_Transformation_Without_Parameters<In, Out>,
    ): Unguaranteed_Transformation_Without_Parameters<In, Out, Error> => {
        return ($: In) => _ei.transformation.successful(the_transformation($))
    }

}

export namespace gt {

    export const g = <In, Out>(
        the_transformation: Guaranteed_Transformation_Without_Parameters<In, Out>,
    ): Guaranteed_Transformation_Without_Parameters<In, Out> => {
        return ($: In) => the_transformation($)
    }

}


/**
 * 
 * @param action a_my_action
 * @param error_transform ($) => ....
 */
export const eh = <Parameters, Error>(
    action: Guaranteed_Action<Parameters>,
    error_transform: Guaranteed_Transformation_Without_Parameters<Error, Parameters>,

): Error_Handler<Error> => {
    return ($: Error) => {
        action(error_transform($)).__start(() => { })
    }

}
export namespace u {

    export namespace a {

        /**
         * 
         * @param action a_my_action
         */
        export const g = <Parameters, Error>(
            action: Guaranteed_Action<Parameters>,
        ): Unguaranteed_Action<Parameters, Error> => ($: Parameters) => {
            return __execute_unguaranteed_action({
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
         * @param action a_my_action
         */
        export const u = <Parameters, Error, Action_Error>(
            action: Unguaranteed_Action<Parameters, Action_Error>,
            error_transform: Guaranteed_Transformation_Without_Parameters<Action_Error, Error>,
            error_handler?: Error_Handler<Action_Error>,
        ): Unguaranteed_Action<Parameters, Error> => ($: Parameters) => {
            return __execute_unguaranteed_action({
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

    export namespace q {

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
         * @param the_query q_my_query
         * @param parameters u.q.*(...)
         * @param result_transformation u.t.*()
         * @param error_transform ($) => ...
         * @param error_handler eh(...)
         * @returns 
         */
        export const u = <Result_After_Transformation, Error, Parameters, Query_Result, Query_Error>(
            the_query: Unguaranteed_Query<Parameters, Query_Result, Query_Error>,
            parameters: Unguaranteed.Query<Parameters, Error>,
            result_transformation: Unguaranteed_Transformation_Without_Parameters<Query_Result, Result_After_Transformation, Error>,
            error_transform: Guaranteed_Transformation_Without_Parameters<Query_Error, Error>,
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
                                    result_transformation(result).process(
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
         * @param the_query q_my_query
         * @param parameters u.q.*()
         * @param result_transformation ($) => ...
         */
        export const g = <Result_After_Transformation, Error, Parameters, Query_Result>(
            the_query: Guaranteed_Query<Parameters, Query_Result>,
            parameters: Unguaranteed.Query<Parameters, Error>,
            result_transformation: Unguaranteed_Transformation_Without_Parameters<Query_Result, Result_After_Transformation, Error>,

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
                                    result_transformation($).process(
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

    export namespace t {

        /**
         * 
         * @param the_transformation ($) => _ea.Unguaranteed_Transformation_Result
         * @param error_transform  ($) => ...
         * @param error_handler  eh()
         * @returns 
         */
        export const u = <In, Out, Error, Transformation_Error>(
            the_transformation: Unguaranteed_Transformation_Without_Parameters<In, Out, Transformation_Error>,
            error_transform: Guaranteed_Transformation_Without_Parameters<Transformation_Error, Error>,
            error_handler?: Error_Handler<Transformation_Error>,

        ): Unguaranteed_Transformation_Without_Parameters<In, Out, Error> => {
            return ($: In) => {
                const result = the_transformation($)
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
         * @param the_transformation ($) => ...
         */
        export const g = <In, Out, Error>(
            the_transformation: Guaranteed_Transformation_Without_Parameters<In, Out>,
        ): Unguaranteed_Transformation_Without_Parameters<In, Out, Error> => {
            return ($: In) => {
                return _ei.transformation.successful(the_transformation($))
            }
        }

    }

    export namespace p {

        /**
         * 
         * @param action u.a.*(...)
         * @param query u.q.*(...)
         */
        export const action = <Error, Parameters>(
            action: Unguaranteed_Action<Parameters, Error>,
            query: Unguaranteed.Query<Parameters, Error>,
        ): Unguaranteed.Procedure<Error> => {
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

        export const sequence = <Error>(
            steps: Unguaranteed.Procedure<Error>[]
        ): Unguaranteed.Procedure<Error> => {
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

    }

}

export namespace g {

    export namespace a {

        export const g = <Parameters>(
            action: Guaranteed_Action<Parameters>,
        ): Guaranteed_Action<Parameters> => ($: Parameters) => {
            return __execute_guaranteed_action({
                'execute': (
                    on_finished,
                ) => {
                    action($).__start(on_finished)
                }
            })
        }
    }

    export namespace q {

        export const fixed = <Query_Result>(
            query_result: Query_Result,
        ): Guaranteed.Query<Query_Result> => {
            return {
                __start: (
                    on_finished,
                ) => {
                    on_finished(query_result)
                }
            }
        }

        export const g = <Result_After_Transformation, Parameters, Query_Result>(
            the_query: Guaranteed_Query<Parameters, Query_Result>,
            parameters: Guaranteed.Query<Parameters>,
            result_transformation: Guaranteed_Transformation_Without_Parameters<Query_Result, Result_After_Transformation>,
        ): Guaranteed.Query<Result_After_Transformation> => {
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

    export namespace p {

        export const action = <Parameters>(
            action: Guaranteed_Action<Parameters>,
            query: Guaranteed.Query<Parameters>,
        ): Guaranteed.Procedure => {
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

}
