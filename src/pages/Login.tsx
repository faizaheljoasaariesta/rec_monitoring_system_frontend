import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative bg-dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/30 blur-3xl"></div>
      </div>

      <div className="relative flex w-full max-w-4xl flex-col">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-40 items-center justify-center rounded-md">
            <img
              src="/logo.png"
              alt="Image"
              className="w-full h-auto"
            />
          </div>
          {/* REC Technology Corporation. */}
        </div>
        <LoginForm />
      </div>
    </div>
  )
}