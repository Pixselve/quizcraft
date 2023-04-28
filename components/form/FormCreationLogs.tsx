import {ApiResponseType} from "@/lib/ApiResponseType";

type FormCreationLogsProps = {
    events: { type: ApiResponseType; text: string }[];
};

function typeToPrefix(type: ApiResponseType) {
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
}

function typeToColor(type: ApiResponseType) {
    switch (type) {
        case ApiResponseType.SELF:
            return "text-warning";
        case ApiResponseType.SUCCESS:
            return "text-success";
        case ApiResponseType.ERROR:
            return "text-error";
        default:
            return "text-white";
    }
}

export default function FormCreationLogs({events}: FormCreationLogsProps) {
    return (
        <div className="mockup-code">
            {events.length === 0 && (
                <pre data-prefix="⏳">
                <code className="text-info">No logs yet</code>
            </pre>
            )}
            {events.map((event, index) => (
                <pre key={index} data-prefix={typeToPrefix(event.type)}>
          <code className={`${typeToColor(event.type)}`}>{event.text}</code>
        </pre>
            ))}
        </div>
    );
}
