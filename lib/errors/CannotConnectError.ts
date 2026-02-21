class CannotConnectError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "CannotConnectError"
    }
}

export default CannotConnectError;