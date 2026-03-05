import Card from '../atoms/Card';
import SectionTitle from '../atoms/SectionTitle';
import ChatbotPanel from './ChatbotPanel';

export default function CustomerInsightsPanel() {
  return (
    <Card>
      <SectionTitle title="Customer Portal" subtitle="Smart Meter Insight Assistant" />
      <h3>Usage Insights</h3>
      <p>Your evening usage this week is 24% above monthly baseline.</p>
      <h3>Billing Explanation</h3>
      <p>Peak HVAC runtime during heatwave drove a projected $18 increase.</p>
      <h3>Chatbot Assistant</h3>
      <ChatbotPanel />
    </Card>
  );
}
