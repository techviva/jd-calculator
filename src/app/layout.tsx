import { Header, Provider, Sidenav } from "@/components/ui";
import { Container, HStack } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Viva Job Calculator",
  description: "Calculate your job's worth",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`} style={{ position: "relative" }}>
        <Provider>
          <Container maxW="100%" p={6} >
            <Header />
            <HStack paddingTop="14px" height="90%" alignItems="flex-start">
              <Sidenav />
              {children}
            </HStack>
          </Container>
        </Provider>
      </body>
    </html>
  );
}
