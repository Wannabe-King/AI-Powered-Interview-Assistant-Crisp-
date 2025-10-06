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
    <Tabs defaultValue="quiz" className="flex flex-col items-center text-black">
      <TabsList className="">
        <TabsTrigger value="quiz">
          <MessageCircle /> Quiz Tab
        </TabsTrigger>
        <TabsTrigger value="interviewer">
          <CircleGauge />
          Performance Dashboard
        </TabsTrigger>
      </TabsList>
      <Interviewee />
      <Dashboard />
    </Tabs>
  );
};
