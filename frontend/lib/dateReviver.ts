export default function dateReviver(_key: any, value: any) {
    if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return value;
}
