import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

export const GoogleQuizQuestionSchema = z.object({
    question: z.string(),
    answers: z.array(z.string()),
    correctAnswers: z.array(z.string()),
});
export const GoogleQuizSchema = z.object({
    title: z.string(),
    questions: z.array(GoogleQuizQuestionSchema),
});
export type GoogleQuiz = z.infer<typeof GoogleQuizSchema>;
export type GoogleQuizQuestion = z.infer<typeof GoogleQuizQuestionSchema>;
export const googleQuizJsonSchema = zodToJsonSchema(GoogleQuizSchema, "GoogleQuizSchema");
