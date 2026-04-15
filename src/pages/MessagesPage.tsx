import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  _id: string;
  text: string;
  senderId: { _id: string; username: string; profilePic?: string };
  receiverId: { _id: string; username: string };
  postId: { _id: string; title: string; images: string[] };
  createdAt: string;
}

const MessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages`, { withCredentials: true });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleReply = async (receiverId: string, postId: string) => {
    const text = replyText[postId];
    if (!text?.trim()) return;

    try {
      await axios.post(`${API_URL}/api/messages`, 
        { receiverId, postId, text }, 
        { withCredentials: true }
      );
      setReplyText(prev => ({ ...prev, [postId]: "" }));
      fetchMessages();
    } catch (err) {
      console.error("Reply failed");
    }
  };

  // Grouping Logic
  const grouped = messages.reduce((acc: any, m) => {
    const key = m.postId?._id || "deleted_post";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
        <h1 className="text-3xl font-black mb-8 italic uppercase tracking-tighter text-primary">Inbox</h1>

        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-dots loading-lg"></span></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-[3rem] shadow-inner border border-base-300">
            <p className="opacity-40 font-bold uppercase tracking-widest">No messages yet</p>
            <button onClick={() => navigate("/")} className="btn btn-primary btn-sm mt-4 rounded-full">Explore Items</button>
          </div>
        ) : (
          Object.entries(grouped).map(([postId, msgs]: any) => {
            const firstMsg = msgs[0];
            const otherParticipant = firstMsg.senderId._id === currentUser.id ? firstMsg.receiverId : firstMsg.senderId;

            return (
              <div key={postId} className="collapse collapse-arrow bg-base-100 mb-6 rounded-[2.5rem] border border-base-300 shadow-sm overflow-hidden">
                <input type="checkbox" /> 
                
                {/* Header Section */}
                <div className="collapse-title flex items-center gap-4 p-6 hover:bg-base-200/50 transition-colors">
                  <div className="avatar">
                    <div className="w-14 h-14 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={firstMsg.postId?.images?.[0] || "https://placehold.co/100"} alt="post" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-black text-sm uppercase truncate max-w-[200px] md:max-w-md">{firstMsg.postId?.title}</h2>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Chatting with {otherParticipant.username}</p>
                  </div>
                </div>

                {/* Chat Body */}
                <div className="collapse-content px-4 md:px-8 pb-8 bg-base-200/30">
                  <div className="flex flex-col gap-4 py-6 max-h-[400px] overflow-y-auto">
                    {msgs.map((m: Message) => {
                      const isOwn = m.senderId._id === currentUser.id;
                      return (
                        <div key={m._id} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
                          <div className="chat-image avatar">
                            <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-[10px] font-bold">
                              {m.senderId.username[0].toUpperCase()}
                            </div>
                          </div>
                          <div className={`chat-bubble text-sm font-medium shadow-sm ${isOwn ? "chat-bubble-primary" : "bg-white text-gray-800"}`}>
                            {m.text}
                          </div>
                          <div className="chat-footer opacity-30 text-[9px] mt-1 font-bold uppercase">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Box */}
                  <div className="flex gap-2 items-center pt-4 border-t border-base-300">
                    <input 
                      type="text" 
                      placeholder="Send a message..."
                      className="input input-bordered flex-1 rounded-2xl bg-base-100 focus:outline-primary transition-all"
                      value={replyText[postId] || ""}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [postId]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(otherParticipant._id, postId)}
                    />
                    <button 
                      onClick={() => handleReply(otherParticipant._id, postId)}
                      className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </MainLayout>
  );
};

export default MessagesPage;