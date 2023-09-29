import { getServerSession } from "next-auth";
import LoginButton from "@/components/LoginButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FormComponent from "@/components/FormComponent";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div className="space-y-10">
        <h1 className="font-bold text-2xl">
          Create a Google Forms Quiz using a JSON object
        </h1>
        <FormComponent></FormComponent>
      </div>
    );
  }
  return (
    <div className="h-full">
      <div className="hero-content flex-col lg:flex-row">
        <div>
          <h1 className="font-bold text-5xl">
            Create a Google Forms Quiz using{" "}
            <span className="text-primary">JSON</span>
          </h1>
          <p className="py-6">
            Effortlessly transform your JSON data into interactive Google Forms
            quizzes! With our user-friendly platform, generate customized
            quizzes in no time by simply uploading your JSON file. Perfect for
            educators, trainers, and event organizers, QuizCraft streamlines
            quiz creation and management, saving you time and effort. Get
            started now and unlock the full potential of your data!
          </p>
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  );
}
