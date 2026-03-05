import ChatComposer from '../molecules/ChatComposer';

export default function ChatbotPanel() {
  return (
    <div className="chatbot">
      <p>
        <strong>TTME Assistant:</strong> Hello! I can explain usage spikes, outage timelines, and
        savings tips.
      </p>
      <ChatComposer />
    </div>
  );
}
