import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as fs from "fs"

import * as pathlib from "path"
import { spawnSync } from 'child_process'

export type Read_Directory_Result =
    | ['success', _et.Dictionary<Node_Type>]
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
    ]

export type Copy_Result =
    | ['success', null]
    | ['error',
        | ['source does not exist', null]
        | ['node is not a file', null]
        | ['permission denied', null]
        | ['file too large', null]
        | ['device not ready', null]
    ]

export type Remove_Result =
    | ['success', null]
    | ['error',
        | ['node does not exist', null]
        | ['node is not a directory', null]
        | ['permission denied', null]
    ]

export type Stat_Result =
    | ['success', Node_Type]
    | ['error',
        | ['node does not exist', null]
    ]

export type Access_Result =
    | ['success', null]
    | ['error',
        | ['node does not exist', null]
        | ['permission denied', null]
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
        'async result': {
            'read file': (
                path: string,
                escape_spaces_in_path: boolean,
            ): _et.Async_Value<Read_File_Result> => {
                return _ei.cast_to_async_value_imp(($c) => {
                    fs.readFile(possibly_escape_filename(path, escape_spaces_in_path), { 'encoding': 'utf-8' }, (err, data) => {
                        $c(_ei.block(() => {
                            if (err) {
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
                                return _ei.panic(`unhandled fs.readFile error code: ${err.code}`)
                            }
                            return ['success', data]

                        }))
                    })

                })
            },
            'read directory': (
                path: string,
                escape_spaces_in_path: boolean,
            ): _et.Async_Value<Read_Directory_Result> => {
                return _ei.cast_to_async_value_imp(($c) => {
                    fs.readdir(possibly_escape_filename(path, escape_spaces_in_path), {
                        'encoding': 'utf-8',
                        'withFileTypes': true,
                    }, (err, files) => {
                        $c(_ei.block(() => {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    return ['error', ['directory does not exist', null]]
                                }
                                if (err.code === 'ENOTDIR' || err.code === 'EISDIR') {
                                    return ['error', ['node is not a directory', null]]
                                }
                                return _ei.panic(`unhandled fs.readdir error code: ${err.code}`)
                            }
                            const out: { [key: string]: Node_Type } = {}
                            files.forEach((file) => {
                                out[file.name] = file.isFile() ? ['file', null] : ['directory', null]
                            })
                            return ['success', _ei.dictionary_literal(out)]
                        }))
                    })
                })
            },
            'copy': (
                source: string,
                target: string,
                escape_spaces_in_path: boolean,
                options: {
                    recursive?: boolean,
                    force?: boolean,
                    errorOnExist?: boolean,
                }
            ): _et.Async_Value<Copy_Result> => {
                return _ei.cast_to_async_value_imp(($c) => {
                    fs.cp(possibly_escape_filename(source, escape_spaces_in_path), possibly_escape_filename(target, escape_spaces_in_path), options, (err) => {
                        $c(_ei.block(() => {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    return ['error', ['source does not exist', null]]
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
                                return _ei.panic(`unhandled fs.cp error code: ${err.code}`)
                            }
                            return ['success', null]
                        }))
                    })
                })
            },
            'remove': (
                path: string,
                escape_spaces_in_path: boolean,
                options: {

                    // recursive?: boolean,
                    // force?: boolean,
                    // errorOnExist?: boolean,
                }
            ): _et.Async_Value<Remove_Result> => {
                return _ei.cast_to_async_value_imp(($c) => {
                    fs.rm(possibly_escape_filename(path, escape_spaces_in_path), options, (err) => {
                        $c(_ei.block(() => {

                            if (err) {
                                if (err.code === 'ENOENT') {
                                    return ['error', ['node does not exist', null]]
                                }
                                if (err.code === 'EACCES' || err.code === 'EPERM') {
                                    return ['error', ['permission denied', null]]
                                }
                                if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                                    return ['error', ['node is not a directory', null]]
                                }
                                return _ei.panic(`unhandled fs.rm error code: ${err.code}`)
                            }
                            return ['success', null]
                        }))
                    })
                })
            },
            'stat': (path: string, escape_spaces_in_path: boolean): _et.Async_Value<Stat_Result> => {
                return _ei.cast_to_async_value_imp(($c) => {
                    fs.stat(possibly_escape_filename(path, escape_spaces_in_path), (err, stats) => {
                        $c(_ei.block(() => {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    return ['error', ['node does not exist', null]]
                                }
                                return _ei.panic(`unhandled fs.stat error code: ${err.code}`)
                            }
                            return stats.isFile()
                                ? ['success', ['file', null]]
                                : ['success', ['directory', null]]
                        }))
                    })
                })
            },
        },
        'fire and forget': {
            'write file': (
                path: string,
                data: string,
                escape_spaces_in_path: boolean
            ) => {
                const fname = possibly_escape_filename(path, escape_spaces_in_path)
                fs.mkdirSync(pathlib.dirname(fname), { 'recursive': true })
                fs.writeFileSync(fname, data)
            },

        },
        'sync': {
            'make directory (sync)': (
                path: string,
                escape_spaces_in_path: boolean
            ) => {
                fs.mkdirSync(possibly_escape_filename(path, escape_spaces_in_path), {
                    'recursive': true,
                })
            },

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

        // 'access': (
        //     path: string,
        //     escape_spaces_in_path: boolean
        // ): _et.Array<Access_Result> => {
        //     return _ei.cast_to_async_value_imp(($c) => {    
        //         fs.access(possibly_escape_filename(path, escape_spaces_in_path), fs.constants.R_OK | fs.constants.W_OK, (err) => {
        //             $c(_ei.block(() => {
        //                 if (err) {
        //                     if (err.code === 'ENOENT') {
        //                         return _ei.array_literal(['error', ['node does not exist', null]])
        //                     }
        //                     // if (err.code === 'EACCES' || err.code === 'EPERM') {
        //                     //     return _ei.array_literal(['error', ['permission denied', null]])
        //                     // }
        //                     return _ei.panic(`unhandled fs.access error code: ${err.code}`)
        //                 }
        //                 return _ei.array_literal(['success', null])
        //             }))
        //         })                
        //     })
        // },
        // statSync: (path: string): {
        //     'isDirectory': () => boolean,
        // } => {
        //     return fs.statSync(path)
        // },
        // readdirSync: (path: string): string[] => {
        //     return fs.readdirSync(path)
        // },

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