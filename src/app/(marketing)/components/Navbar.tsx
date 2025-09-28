import { CircleGauge, Home, MessageCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { About } from "./About";
import { Interviewee } from "./Interviewee";
import { Dashboard } from "./Dashboard";

export const Navbar = () => {
  return (
    <Tabs defaultValue="home" className="flex flex-col items-center text-black">
      <TabsList className="">
        <TabsTrigger value="home">
          <Home />
          About
        </TabsTrigger>
        <TabsTrigger value="interviewee">
          <MessageCircle /> Interviewee Tab
        </TabsTrigger>
        <TabsTrigger value="interviewer">
          <CircleGauge />
          Interviewer Dashboard
        </TabsTrigger>
      </TabsList>

      <About />
      <Interviewee />
      <Dashboard />
    </Tabs>
  );
};
