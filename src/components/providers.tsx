"use client"

import { SessionProvider } from "next-auth/react"
import { LangProvider } from "@/components/lang-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LangProvider>
        {children}
      </LangProvider>
    </SessionProvider>
  )
}