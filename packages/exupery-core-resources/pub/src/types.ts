
export type Node_Type =
    | ['file', null]
    | ['directory', null]

export type Copy_Error =
    | ['source does not exist', null]
    | ['node is not a file', null]
    | ['permission denied', null]
    | ['file too large', null]
    | ['device not ready', null]

export type Make_Directory_Error =
    | ['directory already exists', null]
    | ['permission denied', null]

export type Remove_Error =
    | ['node does not exist', null]
    | ['node is not a directory', null]
    | ['permission denied', null]

export type Write_File_Error =
    | ['permission denied', null]

export type Read_Directory_Error =
    | ['directory does not exist', null]
    | ['node is not a directory', null]

export type Read_File_Error =
    | ['file does not exist', null]
    | ['node is not a file', null]
    | ['permission denied', null]
    | ['file too large', null]
    | ['device not ready', null]

export type Stat_Error =
    | ['node does not exist', null]