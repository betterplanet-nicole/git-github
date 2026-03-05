export default function DashboardLayout({ operatorContent, customerContent }) {
  return (
    <div className="container">
      <header>
        <h1>TTME - TalkToMyEnergy</h1>
        <p>AI-powered outage copilot and smart meter insight assistant</p>
      </header>
      <main className="grid">
        {operatorContent}
        {customerContent}
      </main>
    </div>
  );
}
