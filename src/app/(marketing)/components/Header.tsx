import Image from "next/image";
import { Navbar } from "./Navbar";

export const Header = () => {
  return (
    <header className="flex flex-col items-center my-8">
      <Image
        src="/icons/logo.svg"
        alt="Logo"
        width={50}
        height={50}
        className="w-20 h-20"
      />
      <h1 className="text-4xl my-4 font-bold">AI Interview Assistant</h1>
      <Navbar />
    </header>
  );
};
