"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import { ApiResponseType } from "@/lib/ApiResponseType";
import Editor, {useMonaco} from '@monaco-editor/react';
import defaultJsonValue from "@/lib/demo.json";

import {googleQuizJsonSchema} from "@/lib/QuizSchemas";


export default function FormComponent() {
  const [jsonContent, setJsonContent] = useState(JSON.stringify(defaultJsonValue, null, 4));
  const [loading, setLoading] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {


    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: "https://json.schemastore.org/github-workflow",
            fileMatch: ["*"],
            schema: googleQuizJsonSchema
          }
        ],
      })
    }
  }, [monaco]);

  const [events, setEvents] = useState<
    { type: ApiResponseType; text: string }[]
  >([]);

  const typeToPrefix = useCallback((type: ApiResponseType) => {
    switch (type) {
      case ApiResponseType.SELF:
        return ">";
      case ApiResponseType.SUCCESS:
        return "✓";
      case ApiResponseType.ERROR:
        return "✗";
        default:
        return "$";
    }
  }, []);

  const typeToColor = useCallback((type: ApiResponseType) => {
    switch (type) {
      case ApiResponseType.SELF:
        return "text-warning";
      case ApiResponseType.SUCCESS:
        return "text-success";
      case ApiResponseType.ERROR:
        return "text-error";
        default:
        return "text-base-100";
    }
  } , []);

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

      <Editor theme="vs-dark" value={jsonContent} onChange={value => setJsonContent(value ?? '')} className="h-[500px] rounded-xl overflow-hidden" defaultLanguage="json" />

      <button disabled={loading} className={`btn ${loading ? "loading" : ""}`}>
        Create Form
      </button>

      <div className="mockup-code">
        {events.map((event, index) => (
          <pre key={index} data-prefix={typeToPrefix(event.type)}>
            <code className={`${typeToColor(event.type)}`}>{event.text}</code>
          </pre>
        ))}
      </div>
    </form>
  );
}
