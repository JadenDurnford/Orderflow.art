import Embed from "@/components/Embed";
import Layout from "@/components/Layout";
import Image from "next/image";

export default function OFA() {
  return (
    <Layout>
      <section className="flex flex-col gap-4 pb-10 pt-8">
        <section>
          <div className="mx-auto max-w-[1920px] px-4">
            <div className="flex flex-col gap-4">
              <div className="w-full border border-dune-200">
                <div className=" bg-dune-50 px-4 py-2">
                  <h1 className="text-xl font-semibold">Order Flow Auctions</h1>
                </div>
              </div>
              <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
                <Embed url="https://dune.com/embeds/3165364/5282805" />
                <Embed url="https://dune.com/embeds/3133161/5226361" />
              </div>
              <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
                <Embed url="https://dune.com/embeds/3165485/5283009" />
                <Embed url="https://dune.com/embeds/3165471/5282982" />
                <Embed url="https://dune.com/embeds/3165551/5283122" />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-[1920px] px-4">
            <div className="flex flex-col gap-4">
              <div className="w-full border border-dune-200">
                <div className=" bg-dune-50 px-4 py-2">
                  <h1 className="text-xl font-semibold">Searcher Stats</h1>
                </div>
              </div>
              <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
                <Embed url="https://dune.com/embeds/3293103/5512900" square={true} />
                <Embed url="https://dune.com/embeds/3293103/5512902" square={true} />
                <Embed url="https://dune.com/embeds/3293103/5512903" square={true} />
                <Embed url="https://dune.com/embeds/3292519/5511932" square={true} />
                <Embed url="https://dune.com/embeds/3292519/5511934" square={true} />
                <Embed url="https://dune.com/embeds/3292519/5511936" square={true} />
              </div>
              <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
                <Embed url="https://dune.com/embeds/3292362/5511766" libmev={true} />
                <Embed url="https://dune.com/embeds/3292490/5511876" libmev={true} />
              </div>
              <span className="w-full border border-dune-200 px-2 py-1 text-center italic">
                special thanks to{" "}
                <a
                  href="https://libmev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dune-600 underline transition-opacity hover:opacity-70"
                >
                  libmev
                </a>{" "}
                for providing atomic backrun profit data
              </span>

              <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
                <Embed url="https://dune.com/embeds/3293144/5512966" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
}
