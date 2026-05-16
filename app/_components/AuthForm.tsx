"use client"

import React, { useState } from "react"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "../_components/ui/field"
import { Input } from "../_components/ui/input"
import { Button } from "../_components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Check, CircleUser, X } from "lucide-react"
import { buttonClass, divClass, inputClass } from "@/lib/tailwindClasses"
import { Separator } from "./ui/separator"
import Image from "next/image"
import { Status } from "@/lib/types"
import { useAuth } from "../_context/authentication"

type Mode = "login" | "register"

const defaultForm = [
    {
        id: "email",
        label: "Email",
        type: "email"
    },
    {
        id: "password",
        label: "Password",
        type: "password"
    },
]
const formType = {
    login: {
        label: "Login",
        form: [...defaultForm],
        subtitle: "Don't have an account? Register instead.",
    },
    register: {
        label: "Register",
        form: [...defaultForm],
        subtitle: "Already have an account? Login instead.",
    }
}

const AuthForm = () => {
    const [mode, setMode] = useState<Mode>("login")
    const [status, setStatus] = useState<Status>({ status: "", message: "" })
    const { label, form, subtitle } = formType[mode]
    const supabase = createSupabaseBrowserClient()
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const { email, password } = Object.fromEntries(formData)

        if (!email || !password) {
            setStatus({ status: "error", message: "Missing email or password." })
            return
        }

        if (mode === "register") {
            const { error } = await supabase.auth.signUp({
                email: email as string,
                password: password as string,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            })

            if (error) setStatus({ status: "error", message: error.message })
            else setStatus({ status: "success", message: "Check your inbox for a confirmation email." })
        }
        else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email as string,
                password: password as string
            })

            if (error) setStatus({ status: "error", message: error.message })
            else window.location.href = `/user/${data.user.id}`
        }
    }

    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                skipBrowserRedirect: false
            },
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return user ?
        <div className={`${divClass} gap-6`}>
            <h1 className="text-4xl mb-2 font-momo">
                Welcome back!
            </h1>
            <p>You're already logged in as {user.email}.</p>
            <div className="flex flex-col gap-3 w-full">
                <Button 
                    className={`bg-gray-50 py-4.5 w-full ${buttonClass}`} 
                    onClick={() => window.location.href = `/user/${user.id}`}
                >
                    Continue to board
                </Button>
                <Button 
                    className={`bg-red-500 text-white py-4.5 w-full ${buttonClass}`}
                    onClick={handleSignOut}
                >
                    Log out
                </Button>
            </div>
        </div> :
        <form 
            onSubmit={handleSubmit}
            method="post"
            className={`${divClass} gap-6`}
        >
            <FieldGroup key={mode} className="gap-4">
                <h1 className="text-4xl font-momo">{label}</h1>
                {
                    form.map((input) => (
                        <Field key={input.id}>
                            <FieldLabel htmlFor={input.id}>{input.label}</FieldLabel>
                            <Input id={input.id} name={input.id} type={input.type} className={inputClass}/>
                        </Field>
                    ))
                }
            </FieldGroup>
            <Field orientation="vertical" className="gap-3 text-center">
                <Button type="submit" className={`bg-[#96ED40]/80 py-4.5 w-full ${buttonClass}`}>
                    {label}
                </Button>
                <span 
                    onClick={() => {
                        setStatus({ status: "", message: "" })
                        setMode(mode === "login" ? "register" : "login")
                    }}
                    className="text-[13px] hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                >
                    {subtitle}
                </span>
                <Separator className="my-2"/>
                <Button 
                    type="reset"
                    onClick={handleGoogle}
                    className={`bg-gray-50 py-4.5 w-full flex items-middle ${buttonClass}`}
                >
                    <Image
                        src="/google-icon.png"
                        alt="Google"
                        width={16}
                        height={16}
                    />
                    Continue with Google
                </Button>
                <Button 
                    type="reset"
                    onClick={() => window.location.href = "/guest"}
                    className={`bg-gray-50 py-4.5 w-full flex items-middle ${buttonClass}`}
                >
                    <CircleUser size={14}/>
                    Continue as guest
                </Button>
            </Field>
            {
                status.message &&
                <span className={`text-[13px] ${status.status === "error" ? "text-destructive bg-red-50 border border-red-200" : "text-green-500 bg-green-50 border border-green-200"} w-full p-2 justify-center items-center rounded-lg flex gap-1`}>
                    {status.status === "error" ? <X size={16}/> : <Check size={16}/>}
                    {status.message}
                </span>
            }
        </form>
}

export default AuthForm