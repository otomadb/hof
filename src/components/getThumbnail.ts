import ky from "ky";

import pseudoNicovideo from "../images/pseudo_nicovideo_thumbnail.jpg";
import deletedNicovideo from "../images/deleted_nicovideo_thumbnail.jpg";

import pseudoYoutube from "../images/pseudo_youtube_thumbnail.png";

import * as v from "valibot";

export default async function (type: string, url: string | null) {
  if (!url) return pseudoNicovideo;

  switch (type) {
    case "nicovideo": {
      const sourceId = /(nm|sm)\d+/.exec(url)?.[0];

      if (!sourceId) {
        return pseudoNicovideo;
      }

      const res = await ky.get(
        new URL(
          `/video/${sourceId}`,
          " https://nicovideo-api-proxy.otomadb.com",
        ),
        {
          retry: 3,
          throwHttpErrors: false,
        },
      );
      if (!res.ok) {
        try {
          const a = await res.json().then((re) =>
            v.parse(
              v.object({
                reason: v.union([
                  v.literal("FETCH_FAILED"),
                  v.literal("INVALID_RESPONSE"),
                ]),
                data: v.unknown(),
              }),
              re,
            ),
          );
          switch (a.reason) {
            case "FETCH_FAILED":
              return deletedNicovideo;
            case "INVALID_RESPONSE":
              console.log(a.data);
              return pseudoNicovideo;
          }
        } catch (e) {
          console.log(e);
          return pseudoNicovideo;
        }
      }

      const a = await res.json();
      const b = v.safeParse(v.object({ thumbnailUrl: v.string() }), a);
      if (!b.success) {
        console.log(b.issues);
        return pseudoNicovideo;
      }

      return b.output.thumbnailUrl;
    }
    case "youtube":
      return pseudoYoutube;
    default:
      return pseudoNicovideo;
  }
}
