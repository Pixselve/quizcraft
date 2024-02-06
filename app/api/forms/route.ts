import { getServerSession } from "next-auth";
import createGoogleQuiz from "@/lib/createGoogleQuiz";
import { z } from "zod";
import { ApiResponseType } from "@/lib/ApiResponseType";
import { GoogleQuizSchema } from "@/lib/QuizSchemas";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // @ts-ignore
  const { accessToken } = session;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let googleQuizData: z.infer<typeof GoogleQuizSchema>;
      try {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: ApiResponseType.INFO,
              text: "Start parsing JSON...",
            }) + "\n",
          ),
        );

        googleQuizData = GoogleQuizSchema.parse(await request.json());
      } catch (e) {
        console.error(e);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: ApiResponseType.ERROR,
              text: "Invalid JSON",
            }) + "\n",
          ),
        );
        controller.close();
        return;
      }
      controller.enqueue(
        encoder.encode(
          JSON.stringify({
            type: ApiResponseType.SUCCESS,
            text: "Parsing JSON successful...",
          }) + "\n",
        ),
      );
      let quiz;
      try {
        quiz = await createGoogleQuiz(googleQuizData, accessToken, controller);
      } catch (e) {
        console.error(e);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: ApiResponseType.ERROR,
              text: "Error creating quiz",
            }) + "\n",
          ),
        );
        controller.close();

        return;
      }

      controller.enqueue(
        encoder.encode(
          JSON.stringify({
            type: ApiResponseType.SUCCESS,
            text: "Quiz created!",
          }) + "\n",
        ),
      );
      controller.enqueue(
        encoder.encode(
          JSON.stringify({
            type: ApiResponseType.INFO,
            text: "Available at: " + quiz.responderUri,
          }) + "\n",
        ),
      );
      controller.close();
    },
  });

  return new Response(stream);
}
