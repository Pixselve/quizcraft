import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "QuizCraft",
  description:
    "Effortlessly transform your JSON data into interactive Google Forms quizzes!",
  authors: [
    {
      name: "Mael Kerichard",
      url: "https://mael.app",
    },
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quizcraft.mael.app",
    title: "QuizCraft",
    description:
      "Effortlessly transform your JSON data into interactive Google Forms quizzes!",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="navbar bg-base-100 max-w-5xl m-auto">
          <div className="navbar-start">
            <a className="btn btn-ghost normal-case text-xl">
              QuizCraft - JSON to Google Forms
            </a>
          </div>

          <div className="navbar-end">
            {session && <LogoutButton></LogoutButton>}
          </div>
        </div>
        <main className="bg-base-200 flex-grow p-4">
          <div className="max-w-5xl m-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
