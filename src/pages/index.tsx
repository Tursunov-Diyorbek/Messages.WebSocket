import axios from 'axios';
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client";
import styles from "./index.module.sass"

let socket: Socket = io("http://192.168.1.43:5000/");
const inter = Inter({ subsets: ['latin'] })

export default function Home({userId}: Record<string, any>) {
  const [usernameId, setUsernameId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [userData, setUserData] = useState<string>("")
  const [allMessages, setAllMessages] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>([]);
  const router = useRouter()
  

  useEffect(() => {
    try{
      axios.get("http://192.168.1.43:5000/user/all").then((res) => setUserInfo(res?.data.users))
    }catch(e){console.log(e)}
  }, [])

  useEffect(() => {
    if(localStorage.getItem("userToken")){
      let user = JSON.parse(localStorage.getItem("userData"))
      setUserData(user.username)
      setUsernameId(user._id)
    }
    else{router.push("/register")}
  }, [])
  

  const name = userInfo.find((item: any) => item._id === userId)

  const sendMessage = () => {
      socket.emit("new-message", {to: userId, from: usernameId, message})
      setMessage("")
  }

  const deleteUser = () => {
    localStorage.clear()
    router.push("/register")
  }

  socket.on("send-message", (msg: any) => {
    setAllMessages(msg)
  })

  console.log(allMessages)


  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      <div className={styles.chatsMenu}>
        <div className={styles.driwer}>
            <button onClick={deleteUser}>Delete Account</button>
            {userInfo.map((item: any, index: number) => {return <div key={index} className={styles.userName} onClick={() => router.push(`/${item._id}`)}>{item.username}</div>})}
        </div>
        {userId && <div className={styles.userChats}>
          <h1>{name?.username}</h1>
          <div className={styles.messages}>
            <div className={styles.messages__chats}>
              <p className={styles.messages__left} style={{backgroundColor: "red"}}>Qalesan</p>
              {allMessages?.message && <p className={styles.messages__right}>{allMessages?.message}</p>}
            </div>
          </div>
          <div className={styles.bottomInput}>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>}
      </div>
    </>
  )
}
