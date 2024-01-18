import Layout from "@/components/Layout";
import { FC } from "react";
import { NotionAPI } from "notion-client";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then((m) => m.Collection),
);

const notion = new NotionAPI();

export async function getStaticProps() {
  const recordMap = await notion.getPage("3043d2671f3043e6afb2e6bc39932446");

  return {
    props: {
      recordMap: recordMap,
    },
    revalidate: 60,
  };
}

type Props = {
  recordMap: ExtendedRecordMap;
};

const Methodology: FC<Props> = ({ recordMap }) => (
  <Layout>
    <section className="overflow-x-scroll pb-10">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        components={{ Collection }}
        showCollectionViewDropdown={true}
      />
    </section>
  </Layout>
);

export default Methodology;
