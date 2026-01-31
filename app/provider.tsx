"use client";
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';


function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = useUser();
    const createNewUser = useMutation(api.user.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>();

    useEffect(() => {
        user && CreateAndGetUser();
    }, [user])

    const CreateAndGetUser = async () => {
        if (user) {
            const results = await createNewUser({
                name: user.fullName ?? '',
                email: user.primaryEmailAddress?.emailAddress ?? ''
            })
            console.log(results);
            setUserDetail(results);
        }
    }
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

