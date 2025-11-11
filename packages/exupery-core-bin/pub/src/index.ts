import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_copy from "exupery-resources/dist/interface/generated/pareto/schemas/copy/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/source"
import * as d_execute_any_procedure_executable from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_procedure_executable/data_types/target"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/target"
import * as d_log_error from "exupery-resources/dist/interface/generated/pareto/schemas/log_error/data_types/target"
import * as d_write_to_stdout from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stdout/data_types/target"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/target"

import * as d_execute_any_query_executable from "exupery-resources/dist/interface/generated/pareto/schemas/execute_any_query_executable/data_types/target"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/target"
import * as d_stat from "exupery-resources/dist/interface/generated/pareto/schemas/stat/data_types/target"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/target"

import { $$ as p_copy_signature } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/copy"
import { $$ as p_make_directory } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/make_directory"
import { $$ as p_stat } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/stat"
import { $$ as p_read_directory } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/read_directory"
import { $$ as p_read_file } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/read_file"
import { $$ as p_execute_any_query_executable } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_any_query_executable"
import { $$ as p_execute_any_procedure_executable } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_any_procedure_executable"
import { $$ as p_log } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log"
import { $$ as p_log_error } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log_error"
import { $$ as p_write_to_stdout } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/write_to_stdout"
import { $$ as p_write_to_stderr } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/write_to_stderr"
import { $$ as p_write_file } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/write_file"



export type Parameters = {
    'arguments': _et.Array<string>,
}

export type Error = {
    'exit code': number
}

export type Available_Standard_Resources = {
    'procedures': {
        'copy': _easync.Unguaranteed_Procedure<d_copy.Parameters, d_copy.Error, null>,
        'make directory': _easync.Unguaranteed_Procedure<d_make_directory.Parameters, d_make_directory.Error, null>,
        'write file': _easync.Unguaranteed_Procedure<d_write_file.Parameters, d_write_file.Error, null>,
        'execute any procedure executable': _easync.Unguaranteed_Procedure<d_execute_any_procedure_executable.Parameters, d_execute_any_procedure_executable.Error, null>,
        'log': _easync.Guaranteed_Procedure<d_log.Parameters, null>,
        'log error': _easync.Guaranteed_Procedure<d_log_error.Parameters, null>,
        'write to stdout': _easync.Guaranteed_Procedure<d_write_to_stdout.Parameters, null>,
        'write to stderr': _easync.Guaranteed_Procedure<d_write_to_stderr.Parameters, null>,
    },
    'queries': {
        'execute any query executable': _easync.Unguaranteed_Procedure<d_execute_any_query_executable.Parameters, d_execute_any_query_executable.Result, d_execute_any_query_executable.Error>,
        'read file': _easync.Unguaranteed_Procedure<d_read_file.Parameters, d_read_file.Result, d_read_file.Error>,
        'stat': _easync.Unguaranteed_Procedure<d_stat.Parameters, d_stat.Result, d_stat.Error>,
        'read directory': _easync.Unguaranteed_Procedure<d_read_directory.Parameters, d_read_directory.Result, d_read_directory.Error>,
    }
}

const create_available_resources = (): Available_Standard_Resources => {
    return {
        'procedures': {
            'copy': p_copy_signature,
            'make directory': p_make_directory,
            'write file': p_write_file,
            'execute any procedure executable': p_execute_any_procedure_executable,
            'log': p_log,
            'log error': p_log_error,
            'write to stdout': p_write_to_stdout,
            'write to stderr': p_write_to_stderr,
        },
        'queries': {
            'execute any query executable': require('../algorithms/queries/unguaranteed/execute_any_query_executable').$$,
            'read file': require('../algorithms/queries/unguaranteed/read_file').$$,
            'stat': require('../algorithms/queries/unguaranteed/stat').$$,
            'read directory': require('../algorithms/queries/unguaranteed/read_directory').$$,
        }
    }
}

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name)
 */
export const run_guaranteed_main_procedure = <Main_Resources>(
    initialize_resources: ($r: Available_Standard_Resources) => Main_Resources,
    main: _easync.Guaranteed_Procedure<Parameters, Main_Resources>
): void => {
    main(
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
        initialize_resources(create_available_resources()),
    ).__start(
        () => { }
    )
}

/**
 * Runs a program main function, passing command line arguments (excluding
 * `node` and the script name), and setting the process exit code to the
 * returned value when the async value completes.
 */
export const run_unguaranteed_main_procedure = <Main_Resources>(
    initialize_resources: ($r: Available_Standard_Resources) => Main_Resources,
    main: _easync.Unguaranteed_Procedure<Parameters, Error, Main_Resources>
): void => {
    main(
        {
            'arguments': _ei.array_literal(process.argv.slice(2))
        },
        initialize_resources(create_available_resources())
    ).__start(
        () => {
        },
        ($) => {
            process.exitCode = $['exit code']
        }
    )
}