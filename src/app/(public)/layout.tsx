import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </>
  )
}