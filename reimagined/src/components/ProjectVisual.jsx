import './project-visual.css';

export default function ProjectVisual({ project, loading = 'lazy' }) {
  if (project.images?.length) return <img className="project-visual-image" src={project.images[0]} alt={`${project.title} project screenshot`} loading={loading} />;
  const beel = project.slug === 'beel';
  return <div className={`project-visual project-visual--${project.slug}`} role="img" aria-label={`${project.title}. ${beel ? 'Product preview' : 'Anonymized project artifact'} placeholder.`}>
    <span className="pv-placeholder">{beel ? 'Product preview to add' : 'Anonymized artifact to add'}</span>
    {beel ? <><span className="pv-beel">beel.</span><span className="pv-channels">Email / Phone / LinkedIn / More</span></> : <><span className="pv-title">{project.title}</span><div className="pv-composition">{['Idea', 'Build', 'Learn'].map((word) => <span key={word}>{word}</span>)}</div></>}
    <span className="pv-note">{beel ? 'One sequencer. Every conversation.' : 'A space for the work, with private details removed.'}</span>
  </div>;
}
