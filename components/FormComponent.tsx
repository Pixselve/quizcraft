"use client";
import {useState} from "react";
import {ApiResponseType} from "@/lib/ApiResponseType";
import defaultJsonValue from "@/lib/demo.json";
import JsonEditor from "@/components/form/JsonEditor";
import FormCreationLogs from "@/components/form/FormCreationLogs";

export default function FormComponent() {
  const [jsonContent, setJsonContent] = useState(
      JSON.stringify(defaultJsonValue, null, 4)
  );
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState<
      { type: ApiResponseType; text: string }[]
  >([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setEvents([
      ...events,
      {
        type: ApiResponseType.SELF,
        text: `Creating a new form...`,
      },
    ]);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonContent,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const decodedValue = decoder.decode(value);
          // split the string on new lines
          const lines = decodedValue.split("\n");
          // remove the last line, which is likely to be incomplete
          lines.pop();

          // parse each line as JSON
          const jsons = lines.map((line) => JSON.parse(line));
          setEvents((events) => [...events, ...jsons]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4 h-full">
        <JsonEditor
            jsonContent={jsonContent}
            onChange={(value) => setJsonContent(value)}
        ></JsonEditor>

        <button disabled={loading} className={`btn ${loading ? "loading" : ""}`}>
          Create Form
        </button>

        <FormCreationLogs events={events}/>
      </form>
  );
}
