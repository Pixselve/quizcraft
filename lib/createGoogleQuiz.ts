import {forms_v1, google} from "googleapis";
import {ApiResponseType} from "@/lib/ApiResponseType";
import {GoogleQuiz, GoogleQuizQuestion} from "@/lib/QuizSchemas";


/**
 * Creates a Google Form quiz using the provided GoogleQuiz object and access token.
 * The function first creates a new Google Form, then updates it with the quiz settings and questions.
 *
 * @param quiz - A GoogleQuiz object containing the title and questions for the quiz.
 * @param accessToken - The access token for the authenticated user.
 * @param controller - A ReadableStreamDefaultController object used to send progress updates to the client.
 * @returns A Promise that resolves to the created forms_v1.Schema$Form object.
 * @throws An Error if there is an issue creating the form or updating its settings and questions.
 */
export default async function createGoogleQuiz(
  quiz: GoogleQuiz,
  accessToken: string,
  controller: ReadableStreamDefaultController<any>
): Promise<forms_v1.Schema$Form> {
  const auth = new google.auth.OAuth2({});

  auth.setCredentials({
    access_token: accessToken,
  });

  const forms = google.forms({
    version: "v1",
    auth,
  });

  controller.enqueue(
    new TextEncoder().encode(
      JSON.stringify({type: ApiResponseType.INFO, text: "Logged in..." }) + "\n"
    )
  );

  const form = await forms.forms.create({
    requestBody: {
      info: {
        title: quiz.title,
        documentTitle: quiz.title,
      },
    },
  });

  const id = form.data?.formId;
  if (!id) {
    console.error("Id not found")
    throw new Error("Error creating form");
  }

  controller.enqueue(
    new TextEncoder().encode(
      JSON.stringify({ type: ApiResponseType.SUCCESS, text: "Form created..." }) + "\n"
    )
  );

  if (quiz.questions.length === 0) {
    console.debug("No questions to add")
    return form.data;
  }

  const questions = questionToGoogleApiFormat(quiz.questions);

  const response = await forms.forms.batchUpdate({
    formId: id,
    requestBody: {
      requests: [
        {
          updateSettings: {
            settings: {
              quizSettings: {
                isQuiz: true,
              },
            },
            updateMask: "quizSettings.isQuiz",
          },
        },
        {
          updateFormInfo: {
            info: {
              description: quiz.description,
            },
            updateMask: "description",
          },
        },
        ...questions,
      ],
    },
  });

  if (response.status !== 200) {
    console.error("Status not 200 on batch update")
    throw new Error("Error creating form");
  }
  controller.enqueue(
    new TextEncoder().encode(
      JSON.stringify({ type: ApiResponseType.SUCCESS, text: "Form updated with the questions..." }) + "\n"
    )
  );
  return form.data;
}

/**
 * Converts an array of GoogleQuizQuestion objects to an array of Google Forms API request objects.
 * Each object in the output array corresponds to a question item in the desired Google Form quiz format.
 *
 * @param questions - An array of GoogleQuizQuestion objects.
 * @returns An array of forms_v1.Schema$Request objects compatible with the Google Forms API.
 */
function questionToGoogleApiFormat(
  questions: GoogleQuizQuestion[]
): forms_v1.Schema$Request[] {
  return questions.map((question, index) => {
    const item: forms_v1.Schema$Item = {
      title: question.question,
      questionItem: {
        question: {
          required: true,
          grading: {
            pointValue: 1,
            correctAnswers: {
              answers: question.correctAnswers.map((answer) => {
                return {
                  value: answer,
                };
              }),
            },
          },
          choiceQuestion: {
            type: question.type,
            options: question.answers.map((answer) => {
              return {
                value: answer,
              };
            }),
          },
        },
      },
    };

    return {
      createItem: {
        item,
        location: {
          index,
        },
      },
    };
  });
}
