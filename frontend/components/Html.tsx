import {Text} from "react-native-paper"
import {useMemo} from "react";
import parseHtml from "@/lib/parseHtml";

type HtmlProps = {
    html: string
}

export default function Html({html}: HtmlProps) {
    const segments = useMemo(() => parseHtml(html), [html])

    return (
        <Text>
            {segments.map((seg, i) => {
                return (
                    <Text
                        key={i}
                        style={{
                            fontWeight: seg.bold ? "bold" : undefined,
                            fontStyle: seg.italic ? "italic" : undefined,
                            textDecorationLine: seg.underline ? "underline" : undefined,
                        }}
                    >
                        {seg.text}
                    </Text>)
            })}
        </Text>
    )
}