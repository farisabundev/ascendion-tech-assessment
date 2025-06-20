import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tech Assessment | Challenge 1",
  };
}

const AnswerOne = () => {
  return (
    <div className="flex justify-center h-screen items-center">
      <h1 className="font-bold">Answer to challenge 1</h1>
    </div>
  )
}

export default AnswerOne;