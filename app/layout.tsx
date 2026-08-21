import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가천대 미술치료 과목 이수 플래너",
  description: "졸업·자격·시험·프로포절 요건을 확인하는 과목 이수 플래너",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
