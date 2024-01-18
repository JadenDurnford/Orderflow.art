import Head from "next/head";
import Header from "@/components/Header";
import type { ReactElement } from "react";
import Navigation from "@/components/Navigation";

export default function Layout({ children }: { children: ReactElement | ReactElement[] }) {
  return (
    <main>
      {/* Meta tags */}
      <Meta />

      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />

      {/* Inject children */}
      <div>{children}</div>
    </main>
  );
}

function Meta() {
  const meta = {
    url: "https://orderflow.art",
    image: "https://orderflow.art/meta.png",
    favicon: "https://orderflow.art/favicon.ico",
    title: "Orderflow.art | Illuminating Ethereum's order flow landscape.",
    description:
      "Illuminating Ethereum's order flow landscape. Empowering users with tools to visualize power and profit in the MEV supply network.",
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />

      {/* Favicon */}
      <link rel="icon" href={meta.favicon} sizes="any" />

      {/* OG + Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={meta.url} />
      <meta property="twitter:title" content={meta.title} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
    </Head>
  );
}
