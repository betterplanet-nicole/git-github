export default function PrimaryButton({ children, disabled = false }) {
  return <button disabled={disabled}>{children}</button>;
}
