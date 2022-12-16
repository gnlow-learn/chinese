import { applyPipe } from "npm:froebel/pipe"
import partial from "npm:froebel/partial"


const parse = (input: string) => {
    const regex = /(?<chinese>(?:\p{sc=Han}|[(), ~\u2219\[\]])*) (?<pinyin>(?:\p{sc=Latin}|[(), ~\u2219\[\]])+) (?<korean>(?:\p{sc=Hangul}|[(), ~\u2219\[\]])+)/gu
    return [...input.matchAll(regex)]
}

const convert = 
(format: (chinese: string, pinyin: string, korean: string) => string) =>
(input: string[][]) => {
    return input
        .map(([_, chinese, pinyin, korean]) =>
            format(chinese.trim(), pinyin.trim(), korean.trim())
        )
        .join("\n")
}

for await (const dirEntry of Deno.readDir("./raw")) {
    await applyPipe(
        "./raw/" + dirEntry.name,
        Deno.readTextFile,
        parse,
        convert((c, p, k) => `${c};${k};${p}`),
        partial(Deno.writeTextFile, "./words/" + dirEntry.name) as (a: string) => Promise<void>
    )
}