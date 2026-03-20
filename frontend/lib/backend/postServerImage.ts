import {EntryType, isEntry} from "@/types/EntryType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotLoggedInError from "@/lib/errors/NotLoggedInError";
import dateReviver from "@/lib/dateReviver";

export default async function postServerImage(uri: string, id: string, e: EntryType): Promise<EntryType | null> {
    let api_key = await AsyncStorage.getItem("api_key");
    if (api_key === null) {
        throw new NotLoggedInError("couldn't get entries, database didn't have api key stored")
    }
    api_key = JSON.parse(api_key)

    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/uploadImage`

    const filename = uri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData()

    formData.append("image", {
        uri: uri,
        name: id + ".jpg",
        type
    } as any)

    formData.append("image_id", id)

    formData.append("entry", JSON.stringify({
        "body": e.body,
        "created": e.created.toISOString(),
        "last_edited": e.last_edited.toISOString(),
        "id": e.id,
        "image_ids": e.image_ids
    }))

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "X-API-Key": api_key ?? "",
            "Accept": "application/json",
        },
        body: formData
    })

    const outputText = await response.text()
    try {
        const output = JSON.parse(outputText, dateReviver)
        console.log(output)
        if (isEntry(output)) {
            return output
        } else {
            console.error("malformed server entry", output)
            return null
        }
    } catch (e) {
        console.error(e, outputText)
        return null
    }
}