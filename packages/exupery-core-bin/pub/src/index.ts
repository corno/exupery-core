import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


import * as d_copy from "exupery-resources/dist/interface/generated/pareto/schemas/copy/data_types/source"
import * as d_execute_any_procedure_executable from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_procedure_executable/data_types/target"
import * as d_execute_any_smelly_procedure_executable from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_smelly_procedure_executable/data_types/target"
import * as d_execute_any_query_executable from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_query_executable/data_types/target"
import * as d_get_instream_data from "exupery-resources/dist/interface/generated/pareto/schemas/get_instream_data/data_types/target"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/target"
import * as d_log_error from "exupery-resources/dist/interface/generated/pareto/schemas/log_error/data_types/target"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/target"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/target"
import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_stat from "exupery-resources/dist/interface/generated/pareto/schemas/stat/data_types/target"
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/target"
import * as d_write_to_stdout from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stdout/data_types/target"

import * as d_main from "exupery-resources/dist/interface/temp_main"

import { $$ as p_copy_signature } from "./algorithms/procedures/copy"
import { $$ as p_execute_any_procedure_executable } from "./algorithms/procedures/execute_any_procedure_executable"
import { $$ as p_execute_any_smelly_procedure_executable } from "./algorithms/procedures/execute_any_smelly_procedure_executable"
import { $$ as p_log } from "./algorithms/procedures/log"
import { $$ as p_log_error } from "./algorithms/procedures/log_error"
import { $$ as p_make_directory } from "./algorithms/procedures/make_directory"
import { $$ as p_remove } from "./algorithms/procedures/remove"
import { $$ as p_write_file } from "./algorithms/procedures/write_file"
import { $$ as p_write_to_stderr } from "./algorithms/procedures/write_to_stderr"
import { $$ as p_write_to_stdout } from "./algorithms/procedures/write_to_stdout"


import { $$ as q_execute_any_query_executable } from "./algorithms/queries/execute_any_query_executable"
import { $$ as q_get_instream_data } from "./algorithms/queries/get_instream_data"
import { $$ as q_read_directory } from "./algorithms/queries/read_directory"
import { $$ as q_read_file } from "./algorithms/queries/read_file"
import { $$ as q_stat } from "./algorithms/queries/stat"

type temp_instream_parameters = null

export type Available_Standard_Resources = {
    'commands': {
        'copy': _et.Command<d_copy.Error, d_copy.Parameters>
        'execute any procedure executable': _et.Command<d_execute_any_procedure_executable.Error, d_execute_any_procedure_executable.Parameters>
        'execute any smelly procedure executable': _et.Command<d_execute_any_smelly_procedure_executable.Error, d_execute_any_smelly_procedure_executable.Parameters>
        'log error': _et.Command<null, d_log_error.Parameters>
        'log': _et.Command<null, d_log.Parameters>
        'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
        'remove': _et.Command<d_remove.Error, d_remove.Parameters>
        'write file': _et.Command<d_write_file.Error, d_write_file.Parameters>
        'write to stderr': _et.Command<null, d_write_to_stderr.Parameters>
        'write to stdout': _et.Command<null, d_write_to_stdout.Parameters>
    },
    'queries': {
        'execute any query executable': _et.Data_Preparer<d_execute_any_query_executable.Result, d_execute_any_query_executable.Error, d_execute_any_query_executable.Parameters>
        'get instream data': _et.Data_Preparer<d_get_instream_data.Result, null, temp_instream_parameters>
        'read directory': _et.Data_Preparer<d_read_directory.Result, d_read_directory.Error, d_read_directory.Parameters>
        'read file': _et.Data_Preparer<d_read_file.Result, d_read_file.Error, d_read_file.Parameters>
        //'stat': _et.Query<d_stat.Parameters, d_stat.Result, d_stat.Error>
    }
}

const create_available_resources = (): Available_Standard_Resources => {
    return {
        'commands': {
            'copy': p_copy_signature,
            'execute any procedure executable': p_execute_any_procedure_executable,
            'execute any smelly procedure executable': p_execute_any_smelly_procedure_executable,
            'log error': p_log_error,
            'log': p_log,
            'make directory': p_make_directory,
            'remove': p_remove,
            'write file': p_write_file,
            'write to stderr': p_write_to_stderr,
            'write to stdout': p_write_to_stdout,
        },
        'queries': {
            'execute any query executable': q_execute_any_query_executable,
            'get instream data': q_get_instream_data,
            'read directory': q_read_directory,
            'read file': q_read_file,
            // 'stat': q_stat,
        }
    }
}


/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_main_procedure = (
    get_main: ($r: Available_Standard_Resources) => _et.Command<d_main.Error, d_main.Parameters>,
): void => {
    get_main(create_available_resources()).execute(
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
        ($) => $,
    ).__start(
        () => {
        },
        ($) => {
            process.exitCode = $['exit code']
        }
    )
}