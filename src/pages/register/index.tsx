import { useRouter } from "next/navigation";
import Head from 'next/head';
import styles from "./index.module.sass";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../index";

export default function Register() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter()
   

    const onSubmit = async () => {
        try{
            let res = await axios.post(`${baseUrl}user/register`, {
                username: username,
                password: password
            })
            localStorage.setItem("userData", JSON.stringify(res.data.data))
            localStorage.setItem("userToken", res.data.token)  
            router.push("/")
        }
        catch(e){console.log(e)}
    }

    return <>
        <Head>
            <title>Register</title>
        </Head>
        <div className={styles.regStyles}>
            <div className={styles.regCard}>
                <h1>Register</h1>
                <div>
                    <p>Username</p>
                    <input type="text" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button onClick={onSubmit}>Save</button>
            </div>
        </div>
    </>
}