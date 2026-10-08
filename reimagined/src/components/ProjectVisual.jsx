import './project-visual.css';

const compositions = {
  'syft-gtm': ['A market', 'A conversation', 'A feedback loop'],
  'sales-market-outreach': ['Accounts', 'Buyer signals', 'Coverage'],
  'positioning-outreach': ['Founders', 'Customers', 'Investors'],
  'security-rep-routing': ['The right account', 'The right owner', 'The next step'],
  'cafe-rebrand': ['A new identity', 'A social launch', 'A place to land'],
};

export default function ProjectVisual({ project, loading = 'lazy' }) {
  if (project.images?.length) return <img className="project-visual-image" src={project.images[0]} alt={`${project.title} project screenshot`} loading={loading} />;
  const beel = project.slug === 'beel';
  return <div className={`project-visual project-visual--${project.slug}`} role="img" aria-label={`${project.title}. ${beel ? 'Product preview' : 'Anonymized project artifact'} placeholder.`}>
    <span className="pv-placeholder">{beel ? 'Product preview to add' : 'Anonymized artifact to add'}</span>
    {beel ? <><span className="pv-beel">beel.</span><span className="pv-channels">Email / Phone / LinkedIn / More</span></> : <><span className="pv-title">{project.title}</span><div className="pv-composition">{(compositions[project.slug] || ['Idea', 'Build', 'Learn']).map((word) => <span key={word}>{word}</span>)}</div></>}
    <span className="pv-note">{beel ? 'One sequencer. Every conversation.' : 'A space for the work, with private details removed.'}</span>
  </div>;
}
