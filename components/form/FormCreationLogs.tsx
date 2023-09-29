import { ApiResponseType } from "@/lib/ApiResponseType";
import { Code } from "@nextui-org/code";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "@nextui-org/link";

type FormCreationLogsProps = {
  events: { type: ApiResponseType; text: string; id: string }[];
};

function typeToColor(type: ApiResponseType) {
  switch (type) {
    case ApiResponseType.SELF:
      return "warning";
    case ApiResponseType.SUCCESS:
      return "success";
    case ApiResponseType.ERROR:
      return "danger";
    default:
      return "default";
  }
}

const parseText = (event: string): ReactNode => {
  // recognize links and make them clickable
  const linkRegex = /https?:\/\/[^\s]+/g;
  const linkMatches = event.match(linkRegex);
  if (linkMatches) {
    const linkParts = event.split(linkRegex);
    return (
      <>
        {linkParts.map((part, i) => (
          <span key={i}>
            {part}
            {linkMatches[i] && (
              <Link size="sm" href={linkMatches[i]} isExternal showAnchorIcon>
                {
                  // only show the domain name
                  linkMatches[i].replace(/https?:\/\//, "").split("/")[0]
                }
              </Link>
            )}
          </span>
        ))}
      </>
    );
  }

  return event;
};

export default function FormCreationLogs({ events }: FormCreationLogsProps) {
  return (
    <Card>
      <CardHeader>
        <h4 className="font-bold text-xl">Logs</h4>
      </CardHeader>
      <CardBody className="flex flex-col gap-1">
        {events.length === 0 && (
          <pre data-prefix="⏳">
            <Code color="default">No logs yet</Code>
          </pre>
        )}
        {events.toReversed().map((event) => (
          <motion.pre
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            key={event.id}
            className="flex flex-row gap-2 items-center"
          >
            <Code color={typeToColor(event.type)}>{parseText(event.text)}</Code>
          </motion.pre>
        ))}
      </CardBody>
    </Card>
  );
}
