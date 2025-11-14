import * as _et from 'exupery-core-types'
import { __create_unguaranteed_procedure } from '../algorithms/procedure/initialize_procedure'

export type Three_Steps_Error<Step_1_Error, Step_2_Error, Step_3_Error> =
    | ['step1', Step_1_Error]
    | ['step2', Step_2_Error]
    | ['step3', Step_3_Error]

export const three_steps = <Step_1_Error, Step_2_Error, Step_3_Error>(
    step_1: _et.Procedure_Promise<Step_1_Error>,
    step_2: _et.Procedure_Promise<Step_2_Error>,
    step_3: _et.Procedure_Promise<Step_3_Error>,
): _et.Procedure_Promise<Three_Steps_Error<Step_1_Error, Step_2_Error, Step_3_Error>> => {
    return __create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            step_1.__start(
                () => {
                    step_2.__start(
                        () => {
                            step_3.__start(
                                on_success,
                                (error) => {
                                    on_exception(['step3', error])
                                }
                            )
                        },
                        (error) => {
                            on_exception(['step2', error])
                        }
                    )
                },
                (error) => {
                    on_exception(['step1', error])
                }
            )
        }
    })
}