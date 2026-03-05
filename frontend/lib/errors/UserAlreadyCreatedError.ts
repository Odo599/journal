class UserAlreadyCreatedError extends Error {
    constructor(message: string | undefined = undefined) {
        super(message);
        this.name = "UserAlreadyCreatedError"
    }
}

export default UserAlreadyCreatedError;