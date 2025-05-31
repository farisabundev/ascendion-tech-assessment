import { Metadata } from "next";
import Dashboard from "./DashboardClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tech Assessment | Dashboard - Challenge 3",
  };
}

const ChallengeTwo = () => {
  return (
    <Dashboard />
  )
}

export default ChallengeTwo;