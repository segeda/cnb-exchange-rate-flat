import { parse } from "https://deno.land/x/xml@6.0.4/mod.ts"
import { readTXT, readJSON, writeJSON } from "https://deno.land/x/flat@0.0.15/mod.ts"

const denni_kurz_filename = Deno.args[0]
const history_filename = 'history.json'

const denni_kurz = await readTXT(denni_kurz_filename)
const history = await readJSON(history_filename)

const document: any = parse(denni_kurz)

const datum = document.kurzy['@datum']

const radky = document
  .kurzy
  .tabulka
  .radek
  .map((radek: any) => ({
    datum,
    kod: radek['@kod'],
    mena: radek['@mena'],
    mnozstvi: radek['@mnozstvi'],
    kurz: radek['@kurz'],
    zeme: radek['@zeme'],
  }))

for (const radek of radky) {
  if (!history.find((old: any) => old.datum === radek.datum && old.kod === radek.kod)) {
    history.push(radek)
  }
}

await writeJSON(history_filename, history)
