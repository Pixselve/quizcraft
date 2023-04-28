"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <>
      <button
        className="btn btn-xl btn-primary"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </>
  );
}
