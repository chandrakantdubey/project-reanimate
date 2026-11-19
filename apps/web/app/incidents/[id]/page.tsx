import { ArrowLeft, Activity, Clock3, DatabaseZap } from 'lucide-react';

type Detail = {
  incident: { id: string; title: string; service: string; environment: string;
    severity: string; status: string; startedAt: string; resolvedAt: string | null };
  evidence: { id: string; source: string; query: string; capturedAt: string }[];
};

async function getDetail(id: string): Promise<Detail | null> {
  try {
    const origin = process.env.REANIMATE_API_URL ?? 'http://localhost:4000';
    const response = await fetch(`${origin}/v1/incidents/${encodeURIComponent(id)}`, {
      cache: 'no-store', signal: AbortSignal.timeout(5000)
    });
    return response.ok ? await response.json() as Detail : null;
  } catch { return null; }
}

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getDetail(id);
  return <main className="shell"><section className="content" style={{ gridColumn: '1 / -1' }}>
    <header className="topbar"><a href="/" className="brand"><span className="brand-mark">R.</span> REANIMATE</a><span className="status">INCIDENT ROOM · FOUNDATION</span></header>
    <div className="inner"><a href="/" className="back-link"><ArrowLeft size={17} /> Mission Control</a>
      {!detail ? <div className="empty error"><strong>Incident unavailable</strong><p>It may not exist or the local API may be offline.</p></div> : <>
        <div className="eyebrow">INVESTIGATION / {detail.incident.id.slice(0, 8).toUpperCase()}</div>
        <h1>{detail.incident.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>{detail.incident.service} / {detail.incident.environment} · {detail.incident.severity}</p>
        <div className="details" style={{ marginTop: 35 }}>
          <section className="detail-panel"><h2><Activity size={17} style={{ verticalAlign: 'middle' }}/> Evidence collected</h2>
            {detail.evidence.length === 0 ? <p>No telemetry evidence collected yet. Investigation is pending or the worker is unavailable.</p> : detail.evidence.map(item => <div className="evidence-row" key={item.id}>
              <strong><DatabaseZap size={15} style={{ verticalAlign: 'middle' }}/> {item.source.toUpperCase()}</strong>
              <p>{item.query}</p><code>{new Date(item.capturedAt).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</code>
            </div>)}
          </section>
          <section className="detail-panel"><h2><Clock3 size={17} style={{ verticalAlign: 'middle' }}/> Incident record</h2>
            <p>Status: <strong>{detail.incident.status.toUpperCase()}</strong></p>
            <p>Started: {new Date(detail.incident.startedAt).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</p>
            <p>Resolved: {detail.incident.resolvedAt ? new Date(detail.incident.resolvedAt).toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC' : 'Not resolved'}</p>
            <p style={{ borderTop: '1px solid var(--line)', paddingTop: 15 }}>GitHub correlation, AI findings and the diff review are planned for the next milestones. No unsupported RCA is displayed.</p>
          </section>
        </div>
      </>}
    </div>
  </section></main>;
}
