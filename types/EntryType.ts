type EntryType = {
    id: number,
    author_username: string,
    created: string,
    body: string,
    last_edited: number | null
}

function isEntry(obj: any): obj is EntryType {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        typeof obj.body === "string" &&
        typeof obj.created === "string" &&
        typeof obj.author_username === "string" &&
        (typeof obj.last_edited === "number" || obj.last_edited === null)
    );
}


export {EntryType, isEntry};