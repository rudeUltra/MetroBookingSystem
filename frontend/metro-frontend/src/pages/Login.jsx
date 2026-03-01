import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import loginLogo from '../assets/login-logo.png'
export default function LoginPage() {
  return (
    <div className="grid h-screen w-full overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Rudhra Deep 😁
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex items-center justify-center p-8">
        <img
          src={loginLogo}
          alt="Image"
          className="max-w-md w-full h-auto object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
