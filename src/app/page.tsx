import { redirect } from "next/navigation";

export default function Home() {
  redirect("/report/select?shareToken=demo-token-123");
}
