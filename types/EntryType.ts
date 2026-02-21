type EntryType = {
    id: number,
    author_id: number,
    created: string,
    body: string
}

function isEntry(obj: any): obj is EntryType {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "number" &&
        typeof obj.body === "string" &&
        typeof obj.created === "string" &&
        typeof obj.author_id === "number"
    );
}


export {EntryType, isEntry};