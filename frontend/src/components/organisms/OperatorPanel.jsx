import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import AlertList from '../molecules/AlertList';
import LoadStatusRow from '../molecules/LoadStatusRow';

export default function OperatorPanel({ alerts, loads }) {
  return (
    <Card>
      <SectionTitle title="Operator Dashboard" subtitle="Utility Outage Copilot" />
      <h3>Anomaly Alerts</h3>
      <AlertList alerts={alerts} />
      <h3>Outage Heatmap</h3>
      <div className="heatmap">[Prototype Map] Feeder 12 / Feeder 14 hotspot overlay</div>
      <h3>Transformer Load Status</h3>
      <LoadStatusRow loads={loads} />
    </Card>
  );
}
