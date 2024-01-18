import { ReactElement } from "react";

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactElement | ReactElement[];
}) {
  return (
    <div className="w-full border border-dune-200">
      {/* About */}
      <div className="border-b border-b-dune-200 bg-dune-50 px-4 py-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>

      {/* Embed content */}
      <div>{children}</div>
    </div>
  );
}
