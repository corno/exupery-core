import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import * as _easync from 'exupery-core-async'

import * as fs from "fs"

import * as pathlib from "path"
import { spawnSync } from 'child_process'
import { Node_Type } from './types'


// export const temp_resources = {
//     'console': {
//         'log': console.log,
//         'error': console.error,
//         'exit': process.exit,
//     },
//     'process': {
//         // 'get instream data': (
//         //     cb: (data: string) => void,
//         // ): void => {
//         //     const stdin = process.stdin;
//         //     let data = '';
//         //     stdin.setEncoding('utf8');

//         //     stdin.on('data', (chunk: string) => {
//         //         data += chunk;
//         //     });

//         //     stdin.on('end', () => {
//         //         cb(data);
//         //     });

//         //     stdin.resume();
//         // },
//         // 'spawn': (program: string, args: string[], options: { cwd?: string }): _et.Async_Value<Spawn_Result> => {
//         //     return _ei.cast_to_async_value_or_exception_imp((on_value, on_exception) => {

//         //         const x = spawnSync(program, args, {
//         //             cwd: options.cwd,
//         //             encoding: 'utf-8',
//         //         })

//         //         $c({
//         //             pid: x.pid,
//         //             output: _ei.array_literal(x.output.filter(($) => $ !== null)),
//         //             stdout: x.stdout,
//         //             stderr: x.stderr,
//         //             status: x.status === null ? _ei.not_set() : _ei.set(x.status),
//         //             // signal: x.signal,
//         //             error: x.error,
//         //         })
//         //     })
//         // },
//     }
// }