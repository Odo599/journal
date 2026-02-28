type EntryType = {
    id: number,
    author_username?: string,
    created: string,
    body: string,
    last_edited: number | null,
    offline?: boolean
}

function isEntry(obj: any): obj is EntryType {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        typeof obj.body === "string" &&
        typeof obj.created === "string"
    );
}


export {EntryType, isEntry};