import axios from 'axios';
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import styles from "./index.module.sass";
import dayjs from "dayjs";

export const baseUrl = "http://192.168.1.48:5000/";
let socket: Socket = io(baseUrl);
const inter = Inter({ subsets: ["latin"] });

export default function Home({ _id }: Record<string, any>) {
  const [usernameId, setUsernameId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [userData, setUserData] = useState<string>("");
  const [allMessages, setAllMessages] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    try {
      axios
        .get(baseUrl + "user/all")
        .then((res) => setUserInfo(res?.data.users));
    } catch (e) {
      console.log(e);
    }

    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user.username);
        setUsernameId(user._id);
      }
    } else {
      router.push("/register");
    }

    socket.emit("user-messages", { from: usernameId, to: _id });
    socket.on("user-messages", (msg) => {
      setAllMessages(msg.userMessages);
    });
  }, [_id, usernameId, allMessages, router]);

  const name = userInfo?.find((item: any) => item._id === _id);

  const sendMessage = (e: Record<string, any>) => {
    e.preventDefault();
    if (!message) return;

    socket.emit("new-message", { to: _id, from: usernameId, message });
    setMessage("");

    // socket.emit("user-messages", { from: usernameId, to: _id });
    // socket.on("user-messages", (msg) => {
    //   console.log("msgs", msg);

    //   setAllMessages(msg.userMessages);
    // });
  };

  const deleteUser = () => {
    localStorage.clear();
    router.push("/register");
  };

  console.log(allMessages);

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      {/* Header Menu */}

      <div className={styles.chatsMenu}>
        <div className={styles.driwer}>
          <div className={styles.driwer__userinfo}>
            <h1>{userData}</h1>
            <button onClick={deleteUser}>Delete Account</button>
          </div>
          {userInfo
            ?.filter((item: any) => item._id !== usernameId)
            .map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={styles.userName}
                  onClick={() => router.push(`/${item._id}`)}
                >
                  {item.username}
                </div>
              );
            })}
        </div>

        {/* Communication with users */}

        {_id && (
          <div className={styles.userChats}>
            <h1>{name?.username}</h1>
            <div className={styles.messagesUser}>
              <div className={styles.messages}>
                <div className={styles.messages__chats}>
                  <div>
                    {allMessages.userReceiverMessages?.map(
                      (item: any, index: number) => (
                        <p
                          className={styles.messages__left}
                          key={index}
                        >
                          {item.message}
                          <span
                            style={{
                              fontSize: 8,
                              color: "#fff",
                              paddingInlineStart: 5,
                            }}
                          >
                            {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
                          </span>
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    {allMessages.userSendMessages?.map(
                      (item: any, index: number) => (
                        <p
                          className={styles.messages__right}
                          key={index}
                        >
                          {item.message}{" "}
                          <span
                            style={{
                              fontSize: 10,
                              color: "gray",
                              paddingInlineStart: 5,
                            }}
                          >
                            {dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")}
                          </span>
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bottomInput}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}

        {/* group communication */}

        {router.pathname === "/group" && (
          <div className={styles.userChats}>
            <h1>GROUP</h1>
            <div className={styles.messagesUser}>
              <div className={styles.messages}>
                <div className={styles.messages__chats}>
                  <p className={styles.messages__left}>Kimdandedfs</p>
                  <p className={styles.messages__right}>Kimdan</p>
                  {/* {allMessages.userMessages?.map((item) => <p>{item.message}</p>)} */}
                </div>
              </div>
            </div>
            <div className={styles.bottomInput}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}

        <button
          className={styles.group}
          onClick={() => router.push("/group")}
        >
          G
        </button>
      </div>
    </>
  );
}
