import type { Metadata } from "next";
import { Records } from "./_components/records";

export const metadata: Metadata = {
  title: "Records · Dota stats",
  description: "All-time single-match records in Dota 2",
};

export default function RecordsPage() {
  return <Records />;
}
