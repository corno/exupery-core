import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as fs from "fs"

import * as pathlib from "path"
import { spawnSync } from 'child_process'

export type Read_Directory_Result =
    | ['success', _et.Array<string>]
    | ['error',
        | ['directory does not exist', null]
        | ['node is not a directory', null]
    ]

export type Read_File_Result =
    | ['success', string]
    | ['error',
        | ['file does not exist', null]
        | ['node is not a file', null]
        | ['permission denied', null]
        | ['file too large', null]
        | ['device not ready', null]
        | ['unknown error', string]
    ]

export type Node_Type = 
| ['file', null]
| ['directory', null]

const possibly_escape_filename = (path: string, escape: boolean): string => {
    if (escape) {
        return path.replaceAll(" ", '_')
    }
    return path
}

export const temp_resources = {
    'console': {
        'log': console.log,
        'error': console.error,
        'exit': process.exit,
    },

    'fs': {
        'read file sync': (
            path: string,
            escape_spaces_in_path: boolean,
        ): Read_File_Result => {
            try {
                const data = fs.readFileSync(possibly_escape_filename(path, escape_spaces_in_path), 'utf-8')
                return ['success', data]
            } catch (error) {
                const err = error as any
                
                if (err.code === 'ENOENT') {
                    return ['error', ['file does not exist', null]]
                }
                
                if (err.code === 'EACCES' || err.code === 'EPERM') {
                    return ['error', ['permission denied', null]]
                }
                
                if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                    return ['error', ['node is not a file', null]]
                }
                
                if (err.code === 'EFBIG') {
                    return ['error', ['file too large', null]]
                }
                
                if (err.code === 'EIO' || err.code === 'ENXIO') {
                    return ['error', ['device not ready', null]]
                }
                
                return ['error', ['unknown error', err.message || 'Unknown filesystem error']]
            }
        },
        'read dir sync': (
            path: string,
            escape_spaces_in_path: boolean,
        ): _et.Dictionary<Node_Type> => {
            const out: { [key: string]: Node_Type } = {}
            fs.readdirSync(possibly_escape_filename(path, escape_spaces_in_path), {
                'encoding': 'utf-8',
                'withFileTypes': true,
            }).forEach((file) => {
                out[file.name] = file.isFile() ? ['file', null] : ['directory', null]
            })
            return _ei.dictionary_literal(out)
        },
        'copy sync': (
            source: string,
            target: string,
            escape_spaces_in_path: boolean,

            options: {
                recursive?: boolean,
                force?: boolean,
                errorOnExist?: boolean,
            }
        ) => {
            fs.cpSync(possibly_escape_filename(source, escape_spaces_in_path), possibly_escape_filename(target, escape_spaces_in_path), options)
        },
        'remove sync': (
            path: string,
            escape_spaces_in_path: boolean,
            options: {

                // recursive?: boolean,
                // force?: boolean,
                // errorOnExist?: boolean,
            }
        ) => {
            fs.rmSync(possibly_escape_filename(path, escape_spaces_in_path), options)
        },
        'stat sync': (path: string, escape_spaces_in_path: boolean): Node_Type => {
            const x = fs.statSync(possibly_escape_filename(path, escape_spaces_in_path))
            return x.isFile()
                ? ['file', null]
                : ['directory', null]
        },
        'write file sync': (
            path: string,
            data: string,
            escape_spaces_in_path: boolean
        ) => {
            const fname = possibly_escape_filename(path, escape_spaces_in_path)
            fs.mkdirSync(pathlib.dirname(fname), { 'recursive': true })
            fs.writeFileSync(fname, data)
        },
        // 'read directory': (
        //     path: string,
        //     escape_spaces_in_path: boolean,
        // ): Read_Directory_Result => {
        //     path = possibly_escape_filename(path, escape_spaces_in_path)
        //     if (!fs.existsSync(path)) {
        //         return ['error', ['directory does not exist', null]]
        //     }
        //     if (!fs.statSync(path).isDirectory()) {
        //         return ['error', ['node is not a directory', null]]
        //     }
        //     return ['success', _ei.array_literal(fs.readdirSync(path))]
        // },

        'exists': (
            path: string,
            escape_spaces_in_path: boolean
        ): boolean => {
            return fs.existsSync(possibly_escape_filename(path, escape_spaces_in_path))
        },
        // statSync: (path: string): {
        //     'isDirectory': () => boolean,
        // } => {
        //     return fs.statSync(path)
        // },
        // readdirSync: (path: string): string[] => {
        //     return fs.readdirSync(path)
        // },

        'make directory': (
            path: string,
            escape_spaces_in_path: boolean
        ) => {
            fs.mkdirSync(possibly_escape_filename(path, escape_spaces_in_path), {
                'recursive': true,
            })
        },
    },
    'process': {
        'get instream data': (
            cb: (data: string) => void,
        ): void => {
            const stdin = process.stdin;
            let data = '';
            stdin.setEncoding('utf8');

            stdin.on('data', (chunk: string) => {
                data += chunk;
            });

            stdin.on('end', () => {
                cb(data);
            });

            stdin.resume();
        },
        'spawn sync': (program: string, args: string[], options: { cwd?: string }): {
            pid: number;
            output: _et.Array<string>;
            stdout: string;
            stderr: string;
            status: _et.Optional_Value<number>;
            // signal: NodeJS.Signals | null;
            error?: { message: string } | undefined;
        } => {
            const x = spawnSync(program, args, {
                cwd: options.cwd,
                encoding: 'utf-8',
            })

            return {
                pid: x.pid,
                output: _ei.array_literal(x.output.filter(($) => $ !== null)),
                stdout: x.stdout,
                stderr: x.stderr,
                status: x.status === null ? _ei.not_set() : _ei.set(x.status),
                // signal: x.signal,
                error: x.error,
            }
        },
    }
}