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
import { Check, X } from "lucide-react"
import { buttonClass } from "@/lib/tailwindClasses"

type Mode = "login" | "register"
type Status = { status: "error" | "success" | "", message: string }

const inputClass = 'py-4.5 focus:outline-none focus:ring-0 focus:border-transparent duration-300 transition-all'
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
        heading: "Welcome back!",
        form: [...defaultForm],
        subtitle: "Don't have an account? Register instead.",
    },
    register: {
        label: "Register",
        heading: "Good to see you!",
        form: [...defaultForm],
        subtitle: "Already have an account? Login instead.",
    }
}

const AuthForm = () => {
    const [mode, setMode] = useState<Mode>("login")
    const [status, setStatus] = useState<Status>({ status: "", message: "" })
    const { label, heading, form, subtitle } = formType[mode]
    const supabase = createSupabaseBrowserClient()

    // WHAT TO SHOW IF USER ALREADY AUTHENTICATED
    
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
                    emailRedirectTo: `${window.location.origin}/welcome`
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
        })
    }

    return (
        <form 
            onSubmit={handleSubmit}
            method="post"
            className="bg-white rounded-[20px] border shadow-[0px_6px_0px_#3A3A3A] flex flex-col p-8 gap-6 w-1/5 items-center"
        >
            <FieldGroup key={mode} className="gap-4">
                <h1 className="text-4xl mb-2 font-momo">{heading}</h1>
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
                <Button 
                    type="submit"
                    className={`bg-[#96ED40]/80 py-4.5 w-full ${buttonClass}`}
                >
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
                {/* <Separator className="my-2"/>
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
                </Button> */}
            </Field>
            {
                status.message &&
                <span className={`text-[13px] ${status.status === "error" ? "text-destructive bg-red-50 border border-red-200" : "text-green-500 bg-green-50 border border-green-200"} w-full p-2 justify-center items-center rounded-lg flex gap-1`}>
                    {status.status === "error" ? <X size={16}/> : <Check size={16}/>}
                    {status.message}
                </span>
            }
        </form>
    )
}

export default AuthForm