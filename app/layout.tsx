import "./globals.css";
import { getServerSession } from "next-auth";
import LogoutButton from "@/components/LogoutButton";
import { Providers } from "@/app/providers";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { authOptions } from "@/lib/authOptions";

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
        <Providers>
          <Navbar position="static">
            <NavbarBrand>
              <p className="normal-case text-xl font-bold">QuizCraft</p>
            </NavbarBrand>
            <NavbarContent justify="end">
              <NavbarItem>
                {session && <LogoutButton name={session.email}></LogoutButton>}
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <main className="bg-base-200 flex-grow p-4">
            <div className="max-w-5xl m-auto">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
