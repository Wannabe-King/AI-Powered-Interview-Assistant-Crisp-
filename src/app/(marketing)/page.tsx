// import { gemini_call } from "@/server/gemini";

import { Header } from "@/app/(marketing)/components/Header";

export default async function Home() {
  // await gemini_call()
  return (
    <div className="max-w-5xl mx-auto bg-red-500">
      <Header />
    </div>
  );
}
