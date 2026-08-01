import './App.css';
import { HealthStatus } from './components/HealthStatus';

function App() {
  return (
    <main className="app-shell">
      <section className="health-panel" aria-labelledby="health-title">
        <div className="health-header">
          <p className="eyebrow">VetCare Management</p>
          <h1 id="health-title">API Health</h1>
        </div>
        <HealthStatus />
      </section>
    </main>
  );
}

export default App;
