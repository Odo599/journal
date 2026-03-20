function isDate(obj: any): obj is Date {
    return (
        Object.prototype.toString.call(obj) === '[object Date]' &&
        !isNaN(obj.valueOf())
    );
}

type EntryType = {
    id: string,
    body: string,
    created: Date,
    last_edited: Date,
    offline?: boolean,
    image_ids: string[]
}

function isEntry(obj: any): obj is EntryType {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        typeof obj.body === "string" &&
        isDate(obj.created) &&
        isDate(obj.last_edited) &&
        Array.isArray(obj.image_ids) &&
        obj.image_ids.every((e: unknown) => typeof e === "string")
    );
}


export {EntryType, isEntry};