class NotLoggedInError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "NotLoggedInError"
    }
}

export default NotLoggedInError;