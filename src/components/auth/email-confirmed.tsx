import { useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function EmailConfirmedPage() {
  const router = useRouter()

  useEffect(() => {
    // Optional: clear any onboarding-related state or localStorage
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full text-center p-6 space-y-4 shadow-xl rounded-2xl">
        <div className="flex justify-center text-primary">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">Email Confirmed! 🎉</h1>
        <p className="text-muted-foreground">
          You're all set. Let's kick off your budgeting journey!
        </p>
        <CardContent>
          <Button className="w-full" onClick={() => router.push("/onboarding")}>
            Start Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
