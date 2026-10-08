import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUpRight, DownloadSimple } from '@phosphor-icons/react';
import { articles, profile, projects } from '../data';
import ProjectVisual from './ProjectVisual.jsx';
import ContactForm from './ContactForm.jsx';
import InteriorGallery from './InteriorGallery.jsx';
import TravelGallery from './TravelGallery.jsx';
import './content-personal.css';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});
const displayDate = (date) => dateFormat.format(new Date(`${date}T12:00:00Z`));
const categories = ['All work', ...new Set(projects.map((project) => project.category))];

function PageBack({ href, path, children }) {
  return <a draggable={false} className="text-link page-back" href={href(path)}><ArrowLeft size={17} aria-hidden="true" /> {children}</a>;
}

function ArticleMeta({ article }) {
  return <div className="article-meta">{article.date && <time dateTime={article.date}>{displayDate(article.date)}</time>}{article.readTime && <span>{article.readTime}</span>}</div>;
}

export function WorkPage({ href }) {
  const [category, setCategory] = useState('All work');
  const [query, setQuery] = useState('');
  const search = query.trim().toLocaleLowerCase();
  const visibleProjects = projects.filter((project) => (
    (category === 'All work' || project.category === category)
    && (!search || [project.title, project.summary, project.description, project.clientType, ...(project.stack || [])].join(' ').toLocaleLowerCase().includes(search))
  ));

  const clearFilters = () => { setQuery(''); setCategory('All work'); };

  return (
    <section className="work-page personal-work-page">
      <div className="content-page work-page-intro"><div className="page-intro">
        <h1 className="page-heading">From code<br />to conversations.</h1>
        <p className="page-lead">GTM systems, client work, and the engineering projects that came before. A collection of things I’ve helped make work.</p>
      </div>
      <a draggable={false} className="text-link" href="#work-resume" data-scroll="smooth">Resume <ArrowDown size={18} aria-hidden="true" /></a>
      </div>
      <div className="content-page work-index" id="work-index" tabIndex={-1}>
      <div className="personal-index-intro"><h2 className="work-index-heading">The work, in detail.</h2><p>Some projects are public. Client work stays anonymous, with room for screenshots and fuller stories as they’re ready.</p></div>
      <div className="work-search">
        <label htmlFor="project-search">Find a project</label>
        <input id="project-search" className="search-input" type="search" placeholder="Try Beel, outreach, positioning, or Python" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="filter-bar" role="group" aria-label="Filter projects by category">
        {categories.map((item) => <button type="button" className={`filter-button${category === item ? ' is-active' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}
      </div>
      <p className="results-count" role="status">{visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}{category !== 'All work' ? ` in ${category.toLocaleLowerCase()}` : ''}{search ? ` matching “${query.trim()}”` : ''}</p>
      <div className="project-list">
        {visibleProjects.map((project) => (
          <article className="project-row" key={project.slug}>
            <a draggable={false} className="project-row-image" href={href(`/work/${project.slug}`)} tabIndex={-1} aria-hidden="true"><ProjectVisual project={project} /></a>
            <div className="project-row-copy">
              <h2><a draggable={false} href={href(`/work/${project.slug}`)}>{project.title}</a></h2>
              <p>{project.summary}</p>
              <p className="project-category"><span>{project.category}</span>{project.status && <span>{project.status}</span>}</p>
              <a draggable={false} className="text-link" href={href(`/work/${project.slug}`)}>Explore {project.title}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
      {visibleProjects.length === 0 && <div className="empty-state"><h2>No projects found.</h2><p>Try a different word or see the complete collection.</p><button className="quiet-button" type="button" onClick={clearFilters}>Show all projects</button></div>}
      </div>
      <div className="content-page work-resume" id="work-resume">
      <section className="experience-section personal-experience" aria-labelledby="experience-heading"><h2 id="experience-heading">The path so far.</h2><div className="experience-resume-layout"><div className="experience-list">{profile.experience.map(experience => <article className="experience-row" key={`${experience.org}-${experience.period}`}><p className="experience-period">{experience.period}</p><div><h3>{experience.role}</h3><p className="experience-org">{experience.org}</p><p>{experience.summary}</p></div></article>)}</div><aside className="experience-resume" aria-label="Résumé"><a draggable={false} className="experience-resume-open" href={profile.resume} target="_blank" rel="noreferrer" aria-label="Resume — open PDF in a new tab"><span>Resume <ArrowUpRight size={30} aria-hidden="true"/></span><img src="/assets/legacy/resume-preview.png" alt="Preview of Nabeel Thotti’s résumé" width="773" height="1000" loading="lazy"/></a><a draggable={false} className="experience-resume-download" href={profile.resume} download="Nabeel-Thotti-Resume.pdf">Download PDF <DownloadSimple size={19} aria-hidden="true"/></a></aside></div></section>
      </div>
    </section>
  );
}

export function ProjectPage({ href, slug }) {
  const [selectedImage, setSelectedImage] = useState(0);
  useEffect(() => { setSelectedImage(0); }, [slug]);
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFoundPage href={href} />;
  const images = project.images || [];
  const activeImage = Math.max(0, Math.min(selectedImage, images.length - 1));
  const changeImage = (step) => setSelectedImage((index) => (index + step + images.length) % images.length);
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  const problem = project.problem || project.challenge;
  const built = project.built || project.approach || [];
  const hasLinks = project.github || project.live || ['rekognize', 'chess'].includes(project.slug);

  return (
    <section className="content-page project-detail-page personal-case-page">
      <PageBack href={href} path="/work">All work</PageBack>
      <div className="page-intro">
        <h1 className="page-heading">{project.title}</h1>
        <p className="page-lead">{project.summary}</p>
        {project.status && <p className="personal-case-status">{project.status}</p>}
        {hasLinks && <div className="project-actions">
          {project.github && <a draggable={false} className="solid-button" href={project.github} target="_blank" rel="noreferrer">View the code on GitHub</a>}
          {project.live && project.slug !== 'rekognize' && <a draggable={false} className="text-link" href={project.live} target="_blank" rel="noreferrer">Visit the project<ArrowUpRight size={18} aria-hidden="true" /></a>}
          {project.slug === 'rekognize' && <a draggable={false} className="text-link" href={href('/draw')}>Try the drawing experiment<ArrowRight size={18} aria-hidden="true" /></a>}
          {project.slug === 'chess' && <a draggable={false} className="text-link" href={href('/chess')}>Play a game<ArrowRight size={18} aria-hidden="true" /></a>}
        </div>}
      </div>

      <section className={`project-gallery${!images.length ? ' personal-gallery-placeholder' : ''}`} aria-label={`${project.title} visual`}>
        <figure className="gallery-stage">
          {images.length ? <img src={images[activeImage]} alt={`${project.title}, original project screenshot ${activeImage + 1} of ${images.length}`} /> : <ProjectVisual project={project} />}
          <figcaption>{images.length ? `From the original ${project.title} project.` : (project.presentation?.caption || 'Screenshot placeholder. A project visual will be added here.')}</figcaption>
        </figure>
        {images.length > 1 && <>
          <div className="gallery-controls">
            <button className="quiet-button" type="button" onClick={() => changeImage(-1)} aria-label="Previous screenshot"><ArrowLeft size={18} aria-hidden="true" /> Previous</button>
            <span aria-live="polite" aria-atomic="true">{activeImage + 1} / {images.length}</span>
            <button className="quiet-button" type="button" onClick={() => changeImage(1)} aria-label="Next screenshot">Next <ArrowRight size={18} aria-hidden="true" /></button>
          </div>
          <div className="gallery-thumbs" role="group" aria-label="Choose a screenshot">
            {images.map((image, index) => <button type="button" className={activeImage === index ? 'is-active' : ''} aria-pressed={activeImage === index} aria-label={`Show screenshot ${index + 1}`} onClick={() => setSelectedImage(index)} key={image}><img src={image} alt="" loading="lazy" /></button>)}
          </div>
        </>}
      </section>

      <div className="project-story">
        <div className="prose">
          <section><h2>The problem</h2><p>{problem || project.summary}</p></section>
          <section><h2>What I built</h2><p>{project.description}</p>{Array.isArray(built) && built.length > 0 ? <ul>{built.map((item) => <li key={item}>{item}</li>)}</ul> : typeof built === 'string' && <p>{built}</p>}</section>
          <section><h2>{project.status === 'In development' ? 'Where it stands' : 'The result'}</h2><p>{project.result || project.summary}</p></section>
        </div>
        <aside className="project-materials personal-case-context"><h2>Context</h2><dl><dt>Type of work</dt><dd>{project.category}</dd>{project.clientType && <><dt>Client</dt><dd>{project.clientType}</dd></>}{project.status && <><dt>Status</dt><dd>{project.status}</dd></>}</dl>{project.stack?.length > 0 && <><h2>Tools & materials</h2><ul className="tag-list">{project.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul></>}{project.github && <a draggable={false} className="text-link" href={project.github} target="_blank" rel="noreferrer">Browse the repository</a>}{project.clientType && <p className="personal-case-note">Client identity is kept private.</p>}</aside>
      </div>
      <div className="next-project"><p>Keep exploring</p><a draggable={false} href={href(`/work/${nextProject.slug}`)}>{nextProject.title}<ArrowRight size={28} aria-hidden="true" /></a></div>
    </section>
  );
}

export function WritingPage({ href }) {
  return (
    <section className="content-page writing-page personal-writing-page">
      <div className="page-intro"><h1 className="page-heading">Thinking out loud.</h1><p className="page-lead">Essays and things I’m working through. From technology and behavior to the practical details of GTM.</p></div>
      <h2 className="personal-section-title" id="essays">On paper.</h2>
      <div className="article-list">
        {articles.map((article) => (
          <article className="article-row" key={article.slug}>
            <ArticleMeta article={article} />
            <h2><a draggable={false} href={href(`/writing/${article.slug}`)}>{article.shortTitle}</a></h2>
            <p>{article.subtitle}</p>
            <a draggable={false} className="text-link" href={href(`/writing/${article.slug}`)}>Read the essay<ArrowRight size={18} aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ArticlePage({ href, slug }) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFoundPage href={href} />;
  const related = articles.find((item) => item.slug !== slug);
  const headings = article.blocks?.map((block, index) => ({ ...block, index })).filter((block) => block.type === 'heading');
  return (
    <section className="content-page article-page">
      <PageBack href={href} path="/writing">All writing</PageBack>
      <article>
        <header className="page-intro">
          <ArticleMeta article={article} />
          <h1 className="page-heading">{article.title}</h1>
          <p className="article-byline">By {profile.name}</p>
          <div className="article-tools"><a draggable={false} className="text-link" href={article.pdf} target="_blank" rel="noreferrer">Open the original PDF<ArrowRight size={17} aria-hidden="true" /></a><a draggable={false} className="text-link" href={article.pdf} download><DownloadSimple size={17} aria-hidden="true" /> Download PDF</a></div>
        </header>
        {headings?.length > 2 && <details className="article-contents"><summary>In this essay</summary><nav aria-label="Essay contents"><ul>{headings.map((heading) => <li key={heading.index}><a draggable={false} href={`#section-${heading.index}`}>{heading.text}</a></li>)}</ul></nav></details>}
        {article.blocks?.length ? <div className="article-body prose">{article.blocks.map((block, index) => (
          block.type === 'heading'
            ? <h2 id={`section-${index}`} key={index}>{block.text}</h2>
            : <p className={block.type === 'reference' ? 'article-reference' : undefined} key={index}>{block.text}</p>
        ))}</div> : <iframe className="resume-frame" title={`${article.title} — original essay PDF`} src={article.pdf} />}
      </article>
      {related && <div className="next-project"><p>Another thought</p><a draggable={false} href={href(`/writing/${related.slug}`)}>{related.shortTitle}<ArrowRight size={28} aria-hidden="true" /></a></div>}
    </section>
  );
}

function PhotoPlaceholder({ label, className = '' }) {
  return <figure className={`personal-photo-placeholder ${className}`}><div role="img" aria-label={`${label} photo placeholder`}><span>Photo to add</span></div><figcaption>{label}</figcaption></figure>;
}

export function AboutPage({ href }) {
  return (
    <section className="content-page about-page personal-about-page">
      <div className="personal-about-intro">
        <div><p className="personal-location">{profile.location}. From Los Angeles.</p><h1 className="page-heading">Hi, I’m<br />Nabeel.</h1><p className="page-lead">An engineer who found his way into the customer conversation.</p></div>
        <PhotoPlaceholder label="A portrait of Nabeel" className="personal-portrait-placeholder" />
      </div>
      <section className="personal-about-story" aria-labelledby="my-story-heading"><h2 id="my-story-heading">How I got here.</h2><div className="prose">{profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a draggable={false} className="text-link" href={href('/how-i-work')}>How I approach the work<ArrowRight size={18} aria-hidden="true" /></a></div></section>
      <section className="personal-current" aria-labelledby="current-heading"><h2 id="current-heading">What I’m putting<br />my energy into.</h2><div><article><h3>GTM at Syft Data</h3><p>Customer-facing GTM work, built on a software engineering background. I build target lists, signal-based outreach, CRM connections, and reporting, and run Syft’s own GTM the same way.</p></article><article><h3>Building Beel</h3><p>My own sequencer, currently in development. A project I’m building alongside the work that keeps giving me ideas.</p><a draggable={false} className="text-link" href={href('/work/beel')}>Follow the project<ArrowRight size={18} aria-hidden="true" /></a></article></div></section>
      <div className="about-outro"><p>Tell me a little about you?</p><a draggable={false} className="text-link" href={href('/contact')}>Say hello<ArrowRight size={18} aria-hidden="true" /></a></div>
    </section>
  );
}

export function PersonalPage() {
  return (
    <section className="content-page personal-outside personal-life-page" aria-labelledby="outside-heading"><div className="personal-section-intro"><h1 className="page-heading" id="outside-heading">Away from the screen.</h1><p>There’s more to a person than the things they ship.</p></div><div className="personal-interest-slideshows">{profile.interests.map(interest=><article key={interest.title}><h3>{interest.title}</h3><p>{interest.description}</p>{interest.title==='Travel'?<TravelGallery/>:<InteriorGallery/>}</article>)}</div></section>
  );
}

export function ContactPage({ href }) {
  return (
    <section className="content-page contact-page personal-contact-page">
      <div className="page-intro"><p className="personal-location">{profile.location}</p><h1 className="page-heading">Say hello.</h1><p className="page-lead">A thought about something here, a shared interest, or a good conversation. I’d like to hear it.</p></div>
      <ContactForm />
      <div className="personal-contact-body"><a draggable={false} className="personal-linkedin-link" href={profile.linkedin} target="_blank" rel="noreferrer"><span>Find me on<br />LinkedIn.</span><ArrowUpRight weight="light" aria-hidden="true" /></a><div className="personal-contact-note"><p>I’m working in GTM at Syft Data and building Beel. This site is a place for the work, the ideas around it, and the rest of life.</p><p>If you found your way here through one of those things, that’s a good place to start.</p><a draggable={false} className="text-link" href={profile.github} target="_blank" rel="noreferrer">Code lives on GitHub<ArrowUpRight size={18} aria-hidden="true" /></a></div></div>
      <div className="personal-contact-bottom"><p>Or stay a while.</p><a draggable={false} href={href('/about')}>A little more about me</a><a draggable={false} href={href('/work')}>Something I’ve made</a></div>
    </section>
  );
}

const workflowStages = [
  { name: 'Account agent', owner: 'Agent work', question: 'Which accounts deserve a closer look?', description: 'Each client has a Claude Code agent that keeps its goals, context, and account work together. I start with the market and the customers we are trying to reach.', output: 'An account brief with source context.', check: 'Keep the evidence attached so the next person can inspect it.' },
  { name: 'Enrich & prepare', owner: 'Agent work', question: 'What do we need before reaching out?', description: 'Enrich the account, prepare the relevant contact information, and draft outreach using the available context. Missing information stays visible.', output: 'A prepared account and an outreach draft.', check: 'A complete-looking record is not the same as a verified one.' },
  { name: 'Human approval', owner: 'Human decision', question: 'Is this the right message to the right person?', description: 'A person reviews the account, the recipient, and the draft in Slack. They can approve it, change it, or send it back for more work. Approval is the gate before anything is sent.', output: 'An approved message, or a request for revision.', check: 'No approval, no send.', gate: true },
  { name: 'Send', owner: 'Approved action', question: 'Does the action match what was approved?', description: 'Send the approved outreach with its recipient and content intact. Keep a record of the action so the rest of the workflow can check what actually happened.', output: 'A send record tied to the approved outreach.', check: 'A drafted message should never be reported as a sent message.' },
  { name: 'Verify & report', owner: 'Agent work + review', question: 'Did the work reach the CRM correctly?', description: 'Check the CRM against the action that took place. Verify the relevant records and report what happened, including exceptions or missing updates.', output: 'Verified CRM records and a clear report.', check: 'Verify the resulting state, not just that an action ran.' },
  { name: 'Product feedback', owner: 'Back to the team', question: 'What should this teach the product?', description: 'Bring the patterns, friction, and useful customer context back to the product. The workflow becomes an input to the next improvement.', output: 'Feedback the team can use to improve the system.', check: 'Close the loop between customer-facing work and product decisions.' },
];

export function HowIWorkPage({ href }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = workflowStages[activeStep];
  function selectStep(index) {
    setActiveStep(index);
    if (window.matchMedia('(max-width: 700px)').matches) requestAnimationFrame(() => document.getElementById('workflow-detail')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  }
  return (
    <section className="content-page personal-process-page">
      <div className="page-intro"><h1 className="page-heading">One agent per client.<br />A human in the loop.</h1><p className="page-lead">I run GTM work through Claude Code agents: an agent for each client, with others that enrich data, verify the work, report on progress, and check account health. The human decisions stay with us.</p></div>
      <section className="personal-workflow" aria-labelledby="workflow-heading"><div className="personal-section-intro"><h2 className="personal-section-title" id="workflow-heading">Follow the work.</h2><p>Select a step to see what happens, what comes out of it, and where judgment matters.</p></div><div className="personal-workflow-layout"><ol className="personal-workflow-steps">{workflowStages.map((item, index) => <li key={item.name}><button type="button" className={`${index === activeStep ? 'is-active' : ''}${item.gate ? ' is-human-gate' : ''}`} onClick={() => selectStep(index)} aria-pressed={activeStep === index} aria-controls="workflow-detail"><span className="personal-step-number">{index + 1}</span><span>{item.name}{item.gate && <small>Approval required</small>}</span><ArrowRight size={22} aria-hidden="true" /></button>{index < workflowStages.length - 1 && <ArrowDown className="personal-flow-connector" size={21} aria-hidden="true" />}</li>)}</ol><div className="personal-workflow-detail" id="workflow-detail" aria-live="polite" aria-atomic="true"><p className="personal-process-owner">{step.owner}</p><h3>{step.question}</h3><p className="personal-process-description">{step.description}</p><dl><dt>What leaves this step</dt><dd>{step.output}</dd></dl><p className={`personal-process-check${step.gate ? ' is-human-gate' : ''}`}>{step.check}</p><div className="personal-process-navigation"><span>Step {activeStep + 1} of {workflowStages.length}</span><button className="text-link" type="button" onClick={() => selectStep((activeStep + 1) % workflowStages.length)}>{activeStep === workflowStages.length - 1 ? 'Back to the start' : 'Next step'}<ArrowRight size={18} aria-hidden="true" /></button></div></div></div></section>
      <section className="personal-toolkit" aria-labelledby="toolkit-heading"><h2 id="toolkit-heading">The tools behind it.</h2><dl><div><dt>Markets & people</dt><dd>Syft, Apollo, Clay, and ZoomInfo for target accounts, buyer contacts, and signals.</dd></div><div><dt>Conversations</dt><dd>LinkedIn and founder-voice email campaigns in Smartlead. People review the outreach in Slack.</dd></div><div><dt>The source of truth</dt><dd>HubSpot, Attio, and Salesforce connections. Coverage reports and pipeline claims checked against the CRM.</dd></div><div><dt>Experiments & feedback</dt><dd>Landing pages, LinkedIn and Meta audiences, conversion tracking, and product tickets grounded in customer problems.</dd></div></dl></section>
      <div className="personal-process-outro"><h2>Useful systems leave<br />a trail you can trust.</h2><p>The human decision, the action, and the resulting record should stay connected.</p><a draggable={false} className="text-link" href={href('/work')}>See the work behind it<ArrowRight size={18} aria-hidden="true" /></a></div>
    </section>
  );
}

export function ResumePage({ href }) {
  if (!profile.resume) return <section className="content-page resume-page"><PageBack href={href} path="/about">About me</PageBack><h1 className="page-heading">An earlier chapter.</h1><p className="page-lead">My current work and story live on the About page.</p><div className="project-actions"><a draggable={false} className="text-link" href={href('/about')}>Read the current story<ArrowRight size={18} aria-hidden="true" /></a><a draggable={false} className="text-link" href={href('/work')}>Explore the projects</a></div></section>;
  return (
    <section className="content-page resume-page">
      <PageBack href={href} path="/about">About me</PageBack>
      <div className="page-intro"><h1 className="page-heading">An earlier chapter.</h1><p className="page-lead">This historical résumé documents earlier engineering experience. The About page reflects what I’m doing now.</p><div className="article-tools"><a draggable={false} className="solid-button" href={profile.resume} download="Nabeel-Thotti-Resume.pdf"><DownloadSimple size={18} aria-hidden="true" /> Download résumé</a><a draggable={false} className="text-link" href={profile.resume} target="_blank" rel="noreferrer">Open PDF in a new tab</a></div></div>
      <a draggable={false} className="resume-preview" href={profile.resume} target="_blank" rel="noreferrer" aria-label="Open the original résumé PDF"><img src="/assets/legacy/resume-preview.png" alt="Preview of Nabeel Thotti’s original résumé. Open the accessible PDF for the full text." /></a>
      <p className="pdf-fallback">For selectable text and a closer look, <a draggable={false} className="text-link" href={profile.resume}>open the résumé directly</a>.</p>
    </section>
  );
}

export function NotFoundPage({ href }) {
  return <section className="content-page not-found-page"><div className="page-intro"><p className="page-error-code">404</p><h1 className="page-heading">This page wandered off.</h1><p className="page-lead">There’s still plenty to explore.</p><div className="project-actions"><a draggable={false} className="solid-button" href={href('/')}>Back to the homepage</a><a draggable={false} className="text-link" href={href('/work')}>Explore the work</a></div></div></section>;
}
