import * as _et from 'exupery-core-types'

export interface Async_Value_Or_Exception<T, E> {
    map<NT>($v: ($: T) => Async_Value_Or_Exception<NT, E>): Async_Value_Or_Exception<NT, E>
    map_exception<NE>($e: ($: E) => Async_Value_Or_Exception<T, NE>): Async_Value_Or_Exception<T, NE>
    catch(
        $e: ($: E) => _et.Async_Value<T>
    ): _et.Async_Value<T>
    catch_and_map<NT>(
        $v: ($: T) => _et.Async_Value<NT>,
        $e: ($: E) => _et.Async_Value<NT>,
    ): _et.Async_Value<NT>
    __start($i: ($: T) => void, $e: ($: E) => void): void;
}
