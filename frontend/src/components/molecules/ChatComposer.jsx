import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';

export default function ChatComposer() {
  return (
    <div className="chat-input-row">
      <TextInput placeholder="Ask about my bill spike or outage status..." disabled />
      <PrimaryButton disabled>Send</PrimaryButton>
    </div>
  );
}
