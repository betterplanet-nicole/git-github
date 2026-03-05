export default function AlertList({ alerts }) {
  return (
    <ul>
      {alerts.map((alert) => (
        <li key={alert.id}>
          <strong>{alert.id}</strong> - {alert.issue} ({alert.severity}) @ {alert.zone}
        </li>
      ))}
    </ul>
  );
}
