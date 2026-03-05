export default function Chatbot() {
  return (
    <div className="chatbot">
      <p><strong>TTME Assistant:</strong> Hello! I can explain usage spikes, outage timelines, and savings tips.</p>
      <div className="chat-input-row">
        <input placeholder="Ask about my bill spike or outage status..." disabled />
        <button disabled>Send</button>
      </div>
    </div>
  );
}
