import Editor, {useMonaco} from "@monaco-editor/react";
import {useEffect} from "react";
import {googleQuizJsonSchema} from "@/lib/QuizSchemas";

type JsonEditorProps = {
    jsonContent: string;
    onChange: (value: string) => void;
};
export default function ({jsonContent, onChange}: JsonEditorProps) {

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


    return (
        <Editor
            theme="vs-dark"
            value={jsonContent}
            onChange={(value) => onChange(value || "")}
            className="h-[500px] rounded-xl overflow-hidden"
            defaultLanguage="json"
        />
    );
}
