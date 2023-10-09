import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
 const [error, setError] = useState(null);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    //scrollTo(0, 1e10);
    window.scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });

    setChats(msgs);

    setMessage("");

    fetch("http://localhost:8090/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats: msgs, // Envie a lista completa de mensagens
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      msgs.push({ role: "assistant", content: data.output });
        setChats(msgs);
        console.log(chats)
        setIsTyping(false);
        window.scrollTo(0, 1e10);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);

        // Adicionando a mensagem de erro diretamente na resposta da API
        let msgs = chats;
        msgs.push({ role: "system", content: error.message });
        setChats([...msgs]);
        setIsTyping(false);



      });
  };

  return (
    <main>
      <h1>FullStack Chat AI Tutorial</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : error ? "errorMessage" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing..." : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;