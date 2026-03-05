export default function StatusPill({ tone = 'ok', children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
