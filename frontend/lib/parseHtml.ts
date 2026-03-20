import {Parser} from "htmlparser2";

type Segment = {
    text: string,
    bold?: boolean,
    italic?: boolean,
    underline?: boolean
}

export default function parseHtml(html: string): Segment[] {
    const segments: Segment[] = [];

    let currentStyle = {
        bold: false,
        italic: false,
        underline: false,
    };

    const stack: typeof currentStyle[] = [];

    const addLineBreak = () => {
        if (segments[segments.length - 1]?.text !== "\n") {
            segments.push({text: "\n"});
        }
    }

    // noinspection SpellCheckingInspection
    const parser = new Parser({
        onopentag(name) {
            stack.push({...currentStyle});

            if (name === "b" || name === "strong") {
                currentStyle.bold = true;
            }
            if (name === "i" || name === "em") {
                currentStyle.italic = true;
            }
            if (name === "u") {
                currentStyle.underline = true;
            }
            if (name === "br") {
                addLineBreak()
            }
        },

        ontext(text) {
            if (text.trim().length === 0 && !text.includes("\n")) return;

            segments.push({
                text,
                ...currentStyle,
            });
        },

        onclosetag(name) {
            currentStyle = stack.pop() ?? {
                bold: false,
                italic: false,
                underline: false,
            };
            if (name === "div") {
                addLineBreak()
            }
        },
    });

    parser.write(html);
    parser.end();

    if (segments[segments.length - 1]?.text === "\n") {
        segments.pop()
    }

    return segments;
}