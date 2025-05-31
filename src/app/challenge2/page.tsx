import { Metadata } from "next";
import LoginFlow from "./DashboardClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tech Assessment | Login - Challenge 2",
  };
}

const ChallengeTwo = () => {
  return (
    <LoginFlow />
  )
}

export default ChallengeTwo;