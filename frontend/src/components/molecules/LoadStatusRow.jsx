import StatusPill from '../atoms/StatusPill';

export default function LoadStatusRow({ loads }) {
  return (
    <div className="pill-row">
      {loads.map((load) => (
        <StatusPill key={load.id} tone={load.tone}>
          {load.id}: {load.value}
        </StatusPill>
      ))}
    </div>
  );
}
