import Layout from "@/components/Layout";
import SankeyRender from "@/components/sankey/Render";
import fetcher from "@/utils/fetcher";
import { preload } from "swr";

export default function Home() {
  return (
    <Layout>
      <section className="xl:pt-4">
        <div className="mx-auto h-full max-h-full w-full max-w-full px-4 py-6 xl:px-8 xl:pb-6 xl:pt-4">
          <SankeyRender />
        </div>
      </section>
    </Layout>
  );
}
