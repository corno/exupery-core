import * as _ei from 'exupery-core-internals'


class Refine_Guard_Abort_Exception<Error> {
    constructor(
        public readonly error: Error,
    ) { }
}

export type Abort<Error> = (error: Error) => never

export const create_refinement_context = <Result, Internal_Error, External_Error>(
    error_transform: (internal_error: Internal_Error) => External_Error,
    callback: (abort: Abort<Internal_Error>) => Result,
): _ei.Refinement_Result<Result, External_Error> => {
    try {
        return _ei.refinement.successful(callback((error) => {
            throw new Refine_Guard_Abort_Exception(error);
        }))
    } catch (e) {
        if (e instanceof Refine_Guard_Abort_Exception) {
            return _ei.refinement.failed<Result, External_Error>(error_transform(e.error))
        }
        throw e
    }
}