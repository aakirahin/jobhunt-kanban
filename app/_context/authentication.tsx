"use client"

import { User } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

type UserContextType = {
    user: User | null
}

type Props = {
    user: User | null
    children: React.ReactNode
}

const UserContext = createContext<UserContextType | null>(null);

export const useAuth = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error('useAuth must be used within a UserProvider')
    return context
}

export const UserProvider = ({ 
    user, 
    children 
}: Props) => {
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}