import OperatorPanel from '../components/organisms/OperatorPanel';
import { operatorAlerts, transformerLoads } from '../data/dashboardData';

export default function OperatorDashboard() {
  return <OperatorPanel alerts={operatorAlerts} loads={transformerLoads} />;
}
