import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

interface Message {
  id: number;
  text: string;
  fromUser: string;
  time: string;
}

interface MessageBubbleProps {
  fromUser: string;
  text: string;
  time: string;
  isOwn: boolean;
}

const MessageBubble = ({ fromUser, text, time, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 items-start ${isOwn ? "justify-end" : ""}`}>
      {/* Profile placeholder */}
      {!isOwn && (
        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {fromUser[0].toUpperCase()}
        </div>
      )}

      <div
        className={`p-3 rounded-lg shadow max-w-[70%] text-white ${
          isOwn
            ? "bg-gradient-to-r from-purple-500 to-purple-700 ml-auto"
            : "bg-gradient-to-r from-purple-300 to-purple-500"
        }`}
      >
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span>{fromUser}</span>
          <span className="opacity-60 text-xs">
            {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div>{text}</div>
      </div>

      {/* Own messages don't need profile on right */}
      {isOwn && <div className="w-10 h-10 flex-shrink-0" />}
    </div>
  );
};

const MessagesPage = () => {
  const [messageText, setMessageText] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Load draft message if exists
  useEffect(() => {
    const raw = localStorage.getItem("draftMessage");
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      setMessageText(draft.text || "");
      setShowComposer(true); // open modal
    } catch {
      setMessageText(raw);
      setShowComposer(true);
    }

    localStorage.removeItem("draftMessage");
  }, []);

  // Load saved messages
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(saved);
  }, []);

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      fromUser: currentUser?.username || "unknown",
      time: new Date().toISOString(),
    };

    const updated = [...messages, newMessage];
    localStorage.setItem("messages", JSON.stringify(updated));
    setMessages(updated);
    setMessageText("");
    setShowComposer(false);
  };

  // Helper for grouping messages by day
  const groupByDate = (msgs: Message[]) => {
    const groups: Record<string, Message[]> = {};
    msgs.forEach((m) => {
      const date = new Date(m.time);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let key = date.toDateString();
      if (date.toDateString() === today.toDateString()) key = "Today";
      else if (date.toDateString() === yesterday.toDateString()) key = "Yesterday";

      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  };

  const groupedMessages = groupByDate(messages);

  return (
    <div className="bg-base-900 min-h-screen text-white">
      <TopNav />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        {showComposer && (
          <div className="modal modal-open">
            <div className="modal-box bg-base-800 text-white">
              <h3 className="font-bold text-lg mb-2">New Message</h3>

              <p className="text-sm opacity-70 mb-2">
                Sending as: <strong>{currentUser?.username || "Unknown user"}</strong>
              </p>

              <textarea
                className="textarea textarea-bordered w-full h-32 bg-base-700 text-white"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />

              <div className="modal-action">
                <button className="btn" onClick={() => setShowComposer(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-sm opacity-50 mb-2">{date}</div>
              <div className="space-y-2">
                {msgs.map((m) => (
                  <MessageBubble
                    key={m.id}
                    fromUser={m.fromUser}
                    text={m.text}
                    time={m.time}
                    isOwn={m.fromUser === currentUser?.username}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="opacity-70 mt-4">
          Conversations about items you reserved or shared.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default MessagesPage;
