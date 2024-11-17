import { useEffect, useState, useRef } from "react";
import "./App.css";
import gptLogo from "./assets/chatgpt.svg";
import addBtn from "./assets/add-30.png";
import home from "./assets/home.svg";
import sendBtn from "./assets/send.svg";
import userIcon from "./assets/user-icon.png";
import gptImgLogo from "./assets/chatgptLogo.svg";
import { sendMsgToOpenAI } from "./openai";

function App() {
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm ChatGPT. How can I assist you today?",
      isBot: true,
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput("");

    try {
      const res = await sendMsgToOpenAI(input);
      setMessages((prev) => [...prev, { text: res, isBot: true }]);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
    }
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEnter = async (e) => {
    if (e.key == "Enter") {
      await handleSend();
    }
  };
  return (
    <>
      <div className="App">
        <div className="sideBar">
          <div className="upperSide">
            <div className="upperSideTop">
              <img src={gptLogo} alt="" className="logo" />
              <span className="brand">ChatGPT</span>
            </div>
            <button className="midBtn">
              <img src={addBtn} alt="" className="addBtn" />
              NewChat
            </button>
          </div>
          <div className="lowerSide">
            <div className="listItems">
              <img src={home} alt="" className="listItemsImg" />
              Home
            </div>
          </div>
        </div>
        <div className="main">
          <div className="chats">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat ${msg.isBot ? "bot" : "user"}`}>
                <img
                  className="chatImg"
                  src={msg.isBot ? gptImgLogo : userIcon}
                  alt=""
                />
                <p className="txt">{msg.text}</p>
              </div>
            ))}
            <div ref={msgEnd} />
          </div>
          <div className="chatFooter">
            <div className="inp">
              <input
                type="text"
                placeholder="Send a Prompt"
                value={input}
                onKeyDown={handleEnter}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button className="send" onClick={handleSend}>
                <img src={sendBtn} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
