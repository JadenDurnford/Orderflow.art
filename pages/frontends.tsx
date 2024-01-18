import Embed from "@/components/Embed";
import Layout from "@/components/Layout";

export default function Frontend() {
  return (
    <Layout>
      <section className="pb-10">
        <div className="mx-auto max-w-[1920px] px-4 py-6 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="w-full border border-dune-200">
              <div className=" bg-dune-50 px-4 py-2">
                <h3 className="text-lg font-semibold">Frontend Trends Over Time</h3>
              </div>
            </div>
            <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
              <Embed url="https://dune.com/embeds/3162649/5278031" />
            </div>
            <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
              <Embed url="https://dune.com/embeds/3162644/5278021" />
              <Embed url="https://dune.com/embeds/3162646/5278027" />
            </div>
            <div className="w-full border border-dune-200">
              <div className=" bg-dune-50 px-4 py-2">
                <h3 className="text-lg font-semibold">Frontend Market Shares (7d)</h3>
              </div>
            </div>
            <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
              <Embed url="https://dune.com/embeds/3146796/5248450" square={true} />
              <Embed url="https://dune.com/embeds/3162632/5277999" square={true} />
              <Embed url="https://dune.com/embeds/3162634/5278006" square={true} />
            </div>
            <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
              <Embed url="https://dune.com/embeds/3155213/5264821" />
              <Embed url="https://dune.com/embeds/3162597/5277920" />
            </div>
            <div className="flex flex-grow flex-col justify-evenly gap-4 lg:flex-row">
              <Embed url="https://dune.com/embeds/3146796/5248446" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
