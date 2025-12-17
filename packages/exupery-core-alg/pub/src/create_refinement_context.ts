import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'


class Refine_Guard_Abort_Error<Error> {
    constructor(
        public readonly error: Error,
    ) { }
}

export type Abort<Error> = (error: Error) => never

export const create_refinement_context = <Result, Error>(
    callback: (abort: Abort<Error>) => Result,
): _et.Refinement_Result<Result, Error> => {
    try {
        return _ei.__create_success_refinement_result(callback((error) => {
            throw new Refine_Guard_Abort_Error(error);
        }))
    } catch (e) {
        if (e instanceof Refine_Guard_Abort_Error) {
            return _ei.__create_failure_refinement_result<Result, Error>(e.error)
        }
        throw e // re-throw unexpected errors
    }
}