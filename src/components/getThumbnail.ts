import ky from "ky";
import * as v from "valibot";
import pseudoThumbnail from "../images/pseudo_thumbnail.jpg";

export default async function (url: string | null) {
  if (!url) return pseudoThumbnail;

  const roxyUrl = new URL("https://roxy.otodb.net/json");
  roxyUrl.searchParams.set("q", url);

  try {
    const roxyData = v.safeParse(
      v.object({
        title: v.string(),
        url: v.string(),
        thumbnail: v.string(),
      }),
      await ky
        .get(roxyUrl, {
          retry: {
            limit: 3,
            methods: ["get"],
            statusCodes: [408, 429, 500, 502, 503, 504],
            backoffLimit: 3000,
          },
          timeout: 10000,
        })
        .json(),
    );

    if (!roxyData.success) return pseudoThumbnail;
    return roxyData.output.thumbnail;
  } catch (e) {
    console.error(e);
    return pseudoThumbnail;
  }
}
