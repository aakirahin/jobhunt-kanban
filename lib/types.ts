import { CompanySize, ContractType, JobApplicationStatus, WorkArrangement } from "./generated/prisma/enums"

export type Status = { 
    status: "error" | "success" | "" 
    message: string 
}

export type BoardColumn = {
    id: string
    name: string
    colour: string
    position: number
}

export type Job = {
    id: string
    user_id: string,
    title: string,
    company: string,
    salary?: number,
    location: string,
    work_arrangement: WorkArrangement,
    contract_type: ContractType,
    company_size: CompanySize,
    url?: string,
    notes?: string,
    application_status: JobApplicationStatus,
    created_at: Date,
    updated_at: Date
}