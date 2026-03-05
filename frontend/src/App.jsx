import DashboardLayout from './components/templates/DashboardLayout';
import OperatorDashboard from './pages/OperatorDashboard';
import CustomerPortal from './pages/CustomerPortal';

export default function App() {
  return (
    <DashboardLayout
      operatorContent={<OperatorDashboard />}
      customerContent={<CustomerPortal />}
    />
  );
}
