import { writeFile } from "node:fs/promises";
import ky from "ky";
import * as v from "valibot";

const SOURCE_URL = "https://otodb.github.io/10sen-extract/data.json";
const OUTPUT_PATH = new URL("./src/data/10sen.json", import.meta.url);

const data10sen: Record<
  string,
  { count: number; url: string | null; title: string; type: string }[]
> = await ky.get(SOURCE_URL).json();

const resolved: {
  year: string;
  count: number;
  title: string;
  url: string | null;
  thumbnail: string | null;
}[] = [];

for (const [y, d] of Object.entries(data10sen)) {
  console.log(`resolving: ${y} (${d.length} items)`);
  for (const { count, title, url } of d) {
    if (!url) {
      resolved.push({ year: y, count, title, url, thumbnail: null });
      continue;
    }

    const roxyUrl = new URL("https://roxy.otodb.net/json");
    roxyUrl.searchParams.set("q", url);

    try {
      const roxyData = v.safeParse(
        v.object({
          status: v.literal("ok"),
          payload: v.object({
            title: v.string(),
            url: v.string(),
            thumbnail: v.string(),
          }),
        }),
        await ky
          .get(roxyUrl, {
            retry: { limit: 3, methods: ["get"] },
            timeout: 20000,
            throwHttpErrors: false,
          })
          .json(),
      );

      if (!roxyData.success) {
        resolved.push({ year: y, count, title, url, thumbnail: null });
        continue;
      }

      resolved.push({
        year: y,
        count,
        url,
        title: roxyData.output.payload.title,
        thumbnail: roxyData.output.payload.thumbnail,
      });
      console.log(`resolved: ${url}`);
    } catch (e) {
      console.error(e);
      resolved.push({ year: y, count, title, url, thumbnail: null });
    }
  }
}

await writeFile(
  OUTPUT_PATH,
  JSON.stringify(Object.groupBy(resolved, (r) => r.year)),
);
