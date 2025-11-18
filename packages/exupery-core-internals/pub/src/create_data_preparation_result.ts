import * as _et from "exupery-core-types"


/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<Output, Error> = (
    on_result: ($: Output) => void,
    on_error: ($: Error) => void,
) => void

class Data_Preparation_Result_Class<Output, Target_Error> implements _et.Data_Preparation_Result<Output, Target_Error> {
    private executer: Executer<Output, Target_Error>
    constructor(executer: Executer<Output, Target_Error>) {
        this.executer = executer
    }

    transform<New_Output>(
        transformer: _et.Transformer_Without_Parameters<New_Output, Output>
    ): _et.Data_Preparation_Result<New_Output, Target_Error> {
        return new Data_Preparation_Result_Class<New_Output, Target_Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    on_result(transformer($))
                },
                on_error,
            )
        })
    }

    transform_error_temp<New_Target_Error>(
        transform_error: _et.Transformer_Without_Parameters<New_Target_Error, Target_Error>,
    ): _et.Data_Preparation_Result<Output, New_Target_Error> {
        return new Data_Preparation_Result_Class<Output, New_Target_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    on_error(transform_error($))
                },
            )
        })
    }

    process_without_error_transformation<New_Output>(
        processor: _et.Data_Preparer<New_Output, Target_Error, Output>
    ): _et.Data_Preparation_Result<New_Output, Target_Error> {
        return new Data_Preparation_Result_Class<New_Output, Target_Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    processor($).__extract_data(
                        on_result,
                        on_error,
                    )
                },
                on_error,
            )
        })
    }

    process<New_Output, Processor_Error>(
        processor: _et.Data_Preparer<New_Output, Output, Processor_Error>,
        transform_error: (error: Processor_Error) => Target_Error,
    ): _et.Data_Preparation_Result<New_Output, Target_Error> {
        return new Data_Preparation_Result_Class<New_Output, Target_Error>((on_result, on_error) => {
            this.executer(
                ($) => {
                    processor($).__extract_data(
                        on_result,
                        (processor_error) => {
                            on_error(transform_error(processor_error))
                        },
                    )
                },
                on_error,
            )
        })
    }

    rework_error_temp<New_Target_Error, Rework_Error>(
        rework_error: _et.Data_Preparer<New_Target_Error, Target_Error, Rework_Error>,
        transform_rework_error: _et.Transformer_Without_Parameters<New_Target_Error, Rework_Error>,
    ): _et.Data_Preparation_Result<Output, New_Target_Error> {
        return new Data_Preparation_Result_Class<Output, New_Target_Error>((on_result, on_error) => {
            this.executer(
                on_result,
                ($) => {
                    rework_error($).__extract_data(
                        (new_target_error) => {
                            on_error(new_target_error)
                        },
                        (rework_error) => {
                            on_error(transform_rework_error(rework_error))
                        },
                    )
                },
            )
        })
    }



    __extract_data(
        on_result: ($: Output) => void,
        on_error: ($: Target_Error) => void,
    ): void {
        this.executer(on_result, on_error)
    }
}


export function __create_data_preparation_result<T, E>(
    executer: Executer<T, E>,
): _et.Data_Preparation_Result<T, E> {
    return new Data_Preparation_Result_Class<T, E>(executer)

}