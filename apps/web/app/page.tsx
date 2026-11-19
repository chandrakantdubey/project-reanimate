import { Activity, ArrowUpRight, GitBranch, ScanSearch, ShieldCheck, RadioTower } from 'lucide-react';

type Incident = {
  id: string; title: string; service: string; environment: string;
  severity: string; status: string; startedAt: string; createdAt: string;
};

async function fetchIncidents(): Promise<{ items: Incident[]; error?: string }> {
  try {
    const origin = process.env.REANIMATE_API_URL ?? 'http://localhost:4000';
    const response = await fetch(`${origin}/v1/incidents`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`API returned HTTP ${response.status}`);
    const json = await response.json() as { items: Incident[] };
    return { items: json.items };
  } catch {
    return { items: [], error: 'The incident API is unavailable. Check local infrastructure and credentials.' };
  }
}

export default async function MissionControl() {
  const { items, error } = await fetchIncidents();
  const openCount = items.filter(i => i.status === 'firing').length;
  return (
    <main className="shell">
      <aside className="sidebar">
        <a href="/" className="brand" aria-label="Project Reanimate home"><span className="brand-mark">R<span className="brand-dot">.</span></span><span>REANIMATE</span></a>
        <div className="nav-caption">CONTROL PLANE</div>
        <nav aria-label="Primary navigation">
          <a className="nav-link active" href="/"><Activity size={17} aria-hidden /> Mission Control</a>
          <span className="nav-link muted"><ScanSearch size={17} aria-hidden /> Investigations <small>COMING NEXT</small></span>
          <span className="nav-link muted"><GitBranch size={17} aria-hidden /> Remediation <small>COMING NEXT</small></span>
        </nav>
        <div className="sidebar-footer"><ShieldCheck size={17} /> Human-approved recovery<br /><span>Read-only workspace</span></div>
      </aside>
      <section className="content">
        <header className="topbar">
          <div className="breadcrumbs">OPERATIONS <span>/</span> MISSION CONTROL</div>
          <div className="status"><span className="status-pulse"/> FOUNDATION BUILD</div>
        </header>
        <div className="inner">
          <div className="eyebrow">SITUATIONAL AWARENESS <span className="eyebrow-line" /></div>
          <div className="hero-row">
            <div><h1>When systems fail,<br /><em>find out why.</em></h1><p>Real alerts. Traceable evidence. No guessed root causes.</p></div>
            <div className="orb" aria-hidden="true"><RadioTower size={42}/><span className="orb-ring" /></div>
          </div>
          <div className="metrics" aria-label="Incident summary">
            <div className="metric"><div className="metric-label">KNOWN INCIDENTS</div><strong>{error ? '—' : items.length.toString().padStart(2, '0')}</strong><span>Persisted in PostgreSQL</span></div>
            <div className="metric"><div className="metric-label">CURRENTLY FIRING</div><strong className="emphasis">{error ? '—' : openCount.toString().padStart(2, '0')}</strong><span>From Alertmanager</span></div>
            <div className="metric"><div className="metric-label">RECOVERY MODE</div><strong className="word-value">APPROVAL</strong><span>No automatic production writes</span></div>
          </div>
          <div className="section-heading"><h2>Incident feed</h2><span>LIVE INGESTION · LOCAL DEVELOPMENT</span></div>
          {error ? <div className="empty error" role="alert"><strong>Connection interrupted</strong><p>{error}</p><code>GET /v1/incidents</code></div> : null}
          {!error && items.length === 0 ? <div className="empty"><span className="empty-icon"><Activity size={29}/></span><strong>No incidents recorded</strong><p>Start the instrumented checkout demo, introduce the timeout regression, and incidents detected by Alertmanager will appear here.</p><a href="https://github.com/chandrakantdubey/project-reanimate" target="_blank" rel="noopener noreferrer">Project documentation <ArrowUpRight size={14}/></a></div> : null}
          {!error && items.length > 0 ? <div className="incident-list">{items.map(incident => <article className="incident" key={incident.id}>
            <span className={`incident-state ${incident.status === 'firing' ? 'firing' : ''}`}>{incident.status}</span>
            <div><a href={`/incidents/${incident.id}`} className="incident-title">{incident.title} <ArrowUpRight size={14} aria-hidden /></a><p>{incident.service} / {incident.environment} · {incident.severity}</p></div>
            <time dateTime={incident.startedAt}>{new Date(incident.startedAt).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</time>
          </article>)}</div> : null}
          <footer>REANIMATE <span>·</span> KIROWEEN 2026 / FRANKENSTEIN <span>·</span> INCIDENT AUTOMATION WITHOUT BLIND AUTONOMY</footer>
        </div>
      </section>
    </main>
  );
}
