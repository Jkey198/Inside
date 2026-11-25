import type { Metadata } from "next";
import { Workspace } from "@/components/Workspace";

export const metadata: Metadata = {
  title: "Задачи",
};

export default function WorkspacePage() {
  return <Workspace />;
}
