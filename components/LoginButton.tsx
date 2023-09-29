"use client";

import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/button";
import Google from "@/components/Google";

export default function LoginButton() {
  return (
    <>
      <Button
        startContent={<Google className="h-4 fill-current"></Google>}
        color={"primary"}
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </Button>
    </>
  );
}
