import Script from "next/script";

const TIKTOK_HANDLE = "gazeglass";
const TIKTOK_PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;
const TIKTOK_PROFILE_SOURCE_URL = `${TIKTOK_PROFILE_URL}?is_from_webapp=1&sender_device=pc`;

type TikTokStats = {
  followers: number | null;
  following: number | null;
  likes: number | null;
  videos: number | null;
};

type TikTokProfile = {
  displayName: string;
  stats: TikTokStats;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readCount(source: Record<string, unknown> | null, key: string) {
  if (!source) {
    return null;
  }

  const value = source[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const numericValue = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  return null;
}

function extractProfileData(html: string): TikTokProfile | null {
  const match = html.match(/<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);

  if (!match) {
    return null;
  }

  const pageData = asRecord(JSON.parse(match[1]));
  const defaultScope = asRecord(pageData?.__DEFAULT_SCOPE__);
  const userDetail = asRecord(defaultScope?.["webapp.user-detail"]);
  const userInfo = asRecord(userDetail?.userInfo);
  const user = asRecord(userInfo?.user);
  const statsV2 = asRecord(userInfo?.statsV2);
  const stats = asRecord(userInfo?.stats);
  const statsSource = statsV2 ?? stats;

  if (!userInfo || !statsSource) {
    return null;
  }

  return {
    displayName: typeof user?.nickname === "string" ? user.nickname : "Gaze Glass",
    stats: {
      followers: readCount(statsSource, "followerCount"),
      following: readCount(statsSource, "followingCount"),
      likes: readCount(statsSource, "heartCount") ?? readCount(statsSource, "heart"),
      videos: readCount(statsSource, "videoCount"),
    },
  };
}

async function getTikTokProfile() {
  try {
    const response = await fetch(TIKTOK_PROFILE_SOURCE_URL, {
      headers: {
        "accept-language": "en-US,en;q=0.9",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return null;
    }

    return extractProfileData(await response.text());
  } catch {
    return null;
  }
}

function formatCount(value: number | null) {
  if (value === null) {
    return "Live";
  }

  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(1))}M`;
  }

  if (value >= 10_000) {
    return `${Number((value / 1_000).toFixed(1))}K`;
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export async function TikTokTransmissions() {
  const profile = await getTikTokProfile();
  const metrics = [
    { label: "Total likes", value: profile?.stats.likes ?? null },
    { label: "Followers", value: profile?.stats.followers ?? null },
    { label: "Videos", value: profile?.stats.videos ?? null },
    { label: "Following", value: profile?.stats.following ?? null },
  ];

  return (
    <section className="section tiktok-transmissions reveal" id="tiktok-transmissions" aria-labelledby="tiktok-title">
      <div className="tiktok-copy">
        <span className="chapter-stamp">07 / The Glass Broadcasts</span>
        <p className="eyebrow">On TikTok</p>
        <h2 id="tiktok-title">The Glass Moves Where Mortals Gather.</h2>
        <p>
          New visions, first sparks, and public readings gather at the edge of
          the scroll before they return to the archive.
        </p>
        <div className="tiktok-metrics" aria-label={`${profile?.displayName ?? "Gaze Glass"} TikTok engagement data`}>
          {metrics.map((metric) => (
            <div className="tiktok-metric" key={metric.label}>
              <strong>{formatCount(metric.value)}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <a className="text-link" href={TIKTOK_PROFILE_SOURCE_URL} target="_blank" rel="noreferrer">
          Open @{TIKTOK_HANDLE} on TikTok
        </a>
      </div>

      <div className="tiktok-embed-frame">
        <blockquote
          className="tiktok-embed"
          cite={TIKTOK_PROFILE_URL}
          data-embed-from="oembed"
          data-embed-type="creator"
          data-unique-id={TIKTOK_HANDLE}
          style={{ maxWidth: "720px", minWidth: "288px" }}
        >
          <section>
            <a target="_blank" href={`${TIKTOK_PROFILE_URL}?refer=creator_embed`} rel="noreferrer">
              @{TIKTOK_HANDLE}
            </a>
          </section>
        </blockquote>
      </div>

      <Script id="tiktok-creator-embed" src="https://www.tiktok.com/embed.js" strategy="afterInteractive" />
    </section>
  );
}
