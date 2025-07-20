
export class Error<Type> {
    constructor(
        public type: Type,
    ) {
        this.type = type
    }
}