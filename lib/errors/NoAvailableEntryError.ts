class NoAvailableEntryError extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "NoAvailableEntryError"
    }
}

export default NoAvailableEntryError;