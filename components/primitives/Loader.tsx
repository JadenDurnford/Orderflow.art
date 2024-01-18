import { RotateCw } from "lucide-react";

export default function Loader({ title }: { title: string }) {
  return (
    <div className="flex flex-col px-4 py-8 text-center">
      <RotateCw className="mx-auto h-6 w-6 animate-spin" />
      <span className="pt-1 text-sm">{title}</span>
    </div>
  );
}
