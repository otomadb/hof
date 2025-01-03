import ky from "ky";
import pseudoThumbnail from "../images/pseudo_thumbnail.jpg";
import * as v from "valibot";

export default async function (type: string, url: string | null) {
  if (!url) return pseudoThumbnail;

  switch (type) {
    case "nicovideo": {
      const sourceId = /(nm|sm)\d+/.exec(url)?.[0];

      if (!sourceId) {
        return pseudoThumbnail;
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
              return pseudoThumbnail;
            case "INVALID_RESPONSE":
              console.error(a.data);
              return pseudoThumbnail;
          }
        } catch (e) {
          console.error(e);
          return pseudoThumbnail;
        }
      }

      const a = await res.json();
      const b = v.safeParse(v.object({ thumbnailUrl: v.string() }), a);
      if (!b.success) {
        console.error(b.issues);
        return pseudoThumbnail;
      }

      return b.output.thumbnailUrl;
    }
    default:
      return pseudoThumbnail;
  }
}
