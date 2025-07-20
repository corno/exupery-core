import * as pt from 'exupery-core-types'

//This is originally a generated file (from the bin glossary)

export namespace G {}

export namespace N {}

export namespace D {
    
    export namespace Command__Line__Arguments {
        
        export namespace _larguments {
            
            export type A = string
        }
        
        export type _larguments = pt.Array<string>
    }
    
    export type Command__Line__Arguments = {
        readonly 'arguments': pt.Array<string>
    }
    
    export type Exit__code = number
    
    export type Message = string
}

export namespace I {
    
    export type Exit = ($: D.Exit__code, ) => void
    
    export type Main = ($: D.Command__Line__Arguments, ) => void
    
    export type Message__Stream = {
        'data': ($: D.Message, ) => void
        'end': () => void
    }
}

export namespace A {
    
    export type Main = ($is: {
        readonly 'exit': I.Exit
        readonly 'stderr': I.Message__Stream
        readonly 'stdout': I.Message__Stream
    }) => I.Main
}