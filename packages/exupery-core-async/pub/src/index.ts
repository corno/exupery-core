
export * from "./Safe_Query_Result"
export * from "./Unsafe_Query_Result"
export * from "./Unsafe_Command_Result"


//array
    map_async<NT>(
        handle_value: ($: T) => Safe_Query_Result<NT>
    ): Safe_Query_Result<Array<NT>>
    map_async_unsafe<NT, NE>(
        handle_value: ($: T) => Unsafe_Query_Result<NT, NE>
    ): Unsafe_Query_Result<Array<NT>, Array<NE>>

//dictionary



    /**
     * 
     * @param handle_value callback that provides an {@link Safe_Query_Result}. keys are not available.
     */
    query_safe_with_entries<NT>(
        handle_value: ($: T) => Safe_Query_Result<NT>
    ): Safe_Query_Result<Dictionary<NT>>

    query_unsafe_with_entries<NT, NE>(
        handle_value: ($: T) => Unsafe_Query_Result<NT, NE>,
    ): Unsafe_Query_Result<Dictionary<NT>, Dictionary<NE>>