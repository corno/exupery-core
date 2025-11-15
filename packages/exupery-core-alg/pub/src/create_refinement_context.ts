import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'


class Refine_Guard_Abort_Error<Error> {
    constructor(
        public readonly error: Error,
    ) { }
}

export type Abort<Error> = (error: Error) => never

export const create_refinement_context = <Result, Internal_Error, External_Error>(
    error_transform: (internal_error: Internal_Error) => External_Error,
    callback: (abort: Abort<Internal_Error>) => Result,
): _et.Refinement_Result<Result, External_Error> => {
    try {
        return _ei.refinement.successful(callback((error) => {
            throw new Refine_Guard_Abort_Error(error);
        }))
    } catch (e) {
        if (e instanceof Refine_Guard_Abort_Error) {
            return _ei.refinement.failed<Result, External_Error>(error_transform(e.error))
        }
        throw e
    }
}