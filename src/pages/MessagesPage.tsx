import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface Message {
  id: number;
  text: string;
  fromUser: string;
  toUser: string;
  itemId: number;
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
            {new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div>{text}</div>
      </div>
      {isOwn && <div className="w-10 h-10 flex-shrink-0" />}
    </div>
  );
};

const MessagesPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("messages") || "[]");
    // Only show messages where user is sender or receiver
    const relevant = saved.filter(
      (m: Message) =>
        m.fromUser === currentUser?.username || m.toUser === currentUser?.username
    );
    setMessages(relevant);
  }, [currentUser]);

  // Group messages by item
  const groupByItem = (msgs: Message[]) => {
    const groups: Record<number, Message[]> = {};
    msgs.forEach((m) => {
      if (!groups[m.itemId]) groups[m.itemId] = [];
      groups[m.itemId].push(m);
    });
    return groups;
  };

  const groupedMessages = groupByItem(messages);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        {Object.entries(groupedMessages).map(([itemId, msgs]) => (
          <div key={itemId} className="mb-6">
            <div className="text-lg font-semibold mb-2">
              Item: {msgs[0]?.text.includes("reserve") ? msgs[0]?.text.match(/"(.+?)"/)?.[1] : "Item"}
            </div>
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

        <p className="opacity-70 mt-4">
          Conversations about items you reserved or shared.
        </p>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;