import React, {useEffect, useState} from "react";
import { Header } from './Components/Header';

interface User {
    username?: string
}

export const App = (): JSX.Element => {
    const[user, setUser] = useState<User>({})

    useEffect(() => {
        fetch("http://localhost:8080/api/user")
        .then(response => response.json())
        .then((user:User) => {
            console.log(user)
            setUser(user);
        });
    })

    return (
        <>
        <Header heading="Woah"/>
        <div>Hello There Mr.Admin {user.username}</div>
        </>
    )
}
