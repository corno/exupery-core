import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import * as fs from "fs"

import * as pathlib from "path"
import { spawnSync } from 'child_process'

import * as xx from "./cast_to_async_value_or_exception_imp.js"

export interface Async_Value_Or_Exception<T, E> {
    map<NT>($v: ($: T) => Async_Value_Or_Exception<NT, E>): Async_Value_Or_Exception<NT, E>
    map_exception<NE>($e: ($: E) => NE): Async_Value_Or_Exception<T, NE>
    __execute($i: ($: T) => void, $e: ($: E) => void): void;
}


export namespace Raw_Results {
    export type Read_Directory = _et.Dictionary<Node_Type>

    export type Read_File = string

    export type Copy = null
    export type Remove = null

    export type Stat = Node_Type

    export type Access = null

    export type Write_File = null

    export type Make_Directory = null

    // export type Spawn = {
    //     pid: number;
    //     output: _et.Array<string>;
    //     stdout: string;
    //     stderr: string;
    //     status: _et.Optional_Value<number>;
    //     // signal: NodeJS.Signals | null;
    //     error?: { message: string } | undefined;
    // }
}

export namespace Errors {
    export type Read_Directory =
        | ['directory does not exist', null]
        | ['node is not a directory', null]

    export type Read_File =
        | ['file does not exist', null]
        | ['node is not a file', null]
        | ['permission denied', null]
        | ['file too large', null]
        | ['device not ready', null]

    export type Copy =
        | ['source does not exist', null]
        | ['node is not a file', null]
        | ['permission denied', null]
        | ['file too large', null]
        | ['device not ready', null]

    export type Remove =
        | ['node does not exist', null]
        | ['node is not a directory', null]
        | ['permission denied', null]

    export type Stat =
        | ['node does not exist', null]

    export type Access =
        | ['node does not exist', null]
        | ['permission denied', null]

    export type Write_File =
        | ['permission denied', null]

    export type Make_Directory =
        | ['directory already exists', null]
        | ['permission denied', null]
}

export namespace Results {
    export type Read_Directory = Async_Value_Or_Exception<Raw_Results.Read_Directory, Errors.Read_Directory>
    export type Read_File = Async_Value_Or_Exception<Raw_Results.Read_File, Errors.Read_File>
    export type Copy = Async_Value_Or_Exception<Raw_Results.Copy, Errors.Copy>
    export type Remove = Async_Value_Or_Exception<Raw_Results.Remove, Errors.Remove>
    export type Stat = Async_Value_Or_Exception<Raw_Results.Stat, Errors.Stat>
    export type Access = Async_Value_Or_Exception<Raw_Results.Access, Errors.Access>
    export type Write_File = Async_Value_Or_Exception<Raw_Results.Write_File, Errors.Write_File>
    export type Make_Directory = Async_Value_Or_Exception<Raw_Results.Make_Directory, Errors.Make_Directory>
    // export type Spawn = _et.Async_Value<Raw_Results.Spawn>
}



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
        'read file': (
            path: string,
            escape_spaces_in_path: boolean,
        ): Results.Read_File => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
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
        ): Results.Read_Directory => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
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
        ): Results.Copy => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
                fs.cp(possibly_escape_filename(source, escape_spaces_in_path), possibly_escape_filename(target, escape_spaces_in_path), options, (err) => {
                    if (err) {
                        $e(_ei.block((): Errors.Copy => {
                            if (err.code === 'ENOENT') {
                                return ['source does not exist', null]
                            }
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                                return ['node is not a file', null]
                            }
                            if (err.code === 'EFBIG') {
                                return ['file too large', null]
                            }
                            if (err.code === 'EIO' || err.code === 'ENXIO') {
                                return ['device not ready', null]
                            }
                            return _ei.panic(`unhandled fs.cp error code: ${err.code}`)
                        }))
                    } else {
                        $v(null)
                    }
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
        ): Results.Remove => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
                fs.rm(possibly_escape_filename(path, escape_spaces_in_path), options, (err) => {

                    if (err) {
                        $e(_ei.block((): Errors.Remove => {
                            if (err.code === 'ENOENT') {
                                return ['node does not exist', null]
                            }
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                                return ['node is not a directory', null]
                            }
                            return _ei.panic(`unhandled fs.rm error code: ${err.code}`)
                        }))
                    } else {
                        $v(null)
                    }
                })
            })
        },
        'stat': (path: string, escape_spaces_in_path: boolean): Results.Stat => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
                fs.stat(possibly_escape_filename(path, escape_spaces_in_path), (err, stats) => {
                    if (err) {
                        $e(_ei.block(() => {
                            if (err.code === 'ENOENT') {
                                return ['node does not exist', null]
                            }
                            return _ei.panic(`unhandled fs.stat error code: ${err.code}`)
                        }))
                    }
                    $v(stats.isFile()
                        ? ['file', null]
                        : ['directory', null]
                    )
                })
            })
        },
        'write file': (
            path: string,
            data: string,
            escape_spaces_in_path: boolean
        ): Results.Write_File => {
            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {

                const fname = possibly_escape_filename(path, escape_spaces_in_path)
                fs.mkdir(
                    pathlib.dirname(fname),
                    {
                        'recursive': true
                    },
                    (err, path) => {
                        if (err) {
                            $c(_ei.block(() => {
                                if (err.code === 'EACCES' || err.code === 'EPERM') {
                                    return ['error', ['permission denied', null]]
                                }
                                return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                            }))
                            $c(_ei.panic(`unhandled fs.mkdir error code: ${err.code}`))
                            return
                        }
                        fs.writeFile(fname, data, (err) => {
                            $c(_ei.block(() => {
                                if (err) {
                                    if (err.code === 'EACCES' || err.code === 'EPERM') {
                                        return ['error', ['permission denied', null]]
                                    }
                                    return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                                }
                                return ['success', null]
                            }))
                        })
                    }
                )
            })
        },

        'make directory': (
            path: string,
            escape_spaces_in_path: boolean
        ): Results.Make_Directory => {

            return xx.cast_to_async_value_or_exception_imp(($v, $e) => {
                fs.mkdir(
                    possibly_escape_filename(path, escape_spaces_in_path),
                    {
                        'recursive': true,
                    },
                    (err, path) => {
                        $c(_ei.block(() => {
                            if (err) {
                                if (err.code === 'EEXIST') {
                                    return ['error', ['directory already exists', null]]
                                }
                                return _ei.panic(`unhandled fs.mkdir error code: ${err.code}`)
                            }
                            return ['success', null]
                        }))
                    })
            })
        },

    },
    'process': {
        // 'get instream data': (
        //     cb: (data: string) => void,
        // ): void => {
        //     const stdin = process.stdin;
        //     let data = '';
        //     stdin.setEncoding('utf8');

        //     stdin.on('data', (chunk: string) => {
        //         data += chunk;
        //     });

        //     stdin.on('end', () => {
        //         cb(data);
        //     });

        //     stdin.resume();
        // },
        // 'spawn': (program: string, args: string[], options: { cwd?: string }): _et.Async_Value<Spawn_Result> => {
        //     return xx.cast_to_async_value_or_exception_imp(($v, $e) => {

        //         const x = spawnSync(program, args, {
        //             cwd: options.cwd,
        //             encoding: 'utf-8',
        //         })

        //         $c({
        //             pid: x.pid,
        //             output: _ei.array_literal(x.output.filter(($) => $ !== null)),
        //             stdout: x.stdout,
        //             stderr: x.stderr,
        //             status: x.status === null ? _ei.not_set() : _ei.set(x.status),
        //             // signal: x.signal,
        //             error: x.error,
        //         })
        //     })
        // },
    }
}