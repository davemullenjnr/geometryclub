import type { NextConfig } from "next";

const LEGACY_BLOG_ALIASES = [
  "/best-of-2019",
  "/best-of-2018",
  "/mini-series-welbeck-street-car-park-london",
  "/best-of-2017",
  "/creative-review",
  "/best-of-2016",
  "/mini-series-the-broad-museum-la",
  "/best-of-2015",
] as const;

const nextConfig: NextConfig = {
  // Static deploy to Netlify (`publish = "out"`). Production redirects are duplicated in
  // netlify.toml because export builds do not apply these. Kept here for `next dev`.
  output: "export",
  async redirects() {
    const toHome: { source: string; destination: string; permanent: boolean }[] =
      [];

    for (const path of LEGACY_BLOG_ALIASES) {
      toHome.push({
        source: path,
        destination: "/",
        permanent: true,
      });
      toHome.push({
        source: `${path}/`,
        destination: "/",
        permanent: true,
      });
    }

    return [
      ...toHome,
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/support", destination: "/", permanent: true },
      { source: "/support/", destination: "/", permanent: true },
      { source: "/press-kit", destination: "/", permanent: true },
      { source: "/press-kit/", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
