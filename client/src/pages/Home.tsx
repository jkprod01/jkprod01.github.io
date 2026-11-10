import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronRight,
  Clapperboard,
  Download,
  ExternalLink,
  Film,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  Phone,
  Play,
  Plus,
  Scissors,
  Sparkles,
  Sun,
  X,
  Youtube,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  videoUrl: string;
  detailImage?: string;
};

const projectRoles: Record<string, string> = {
  "Film institutionnel": "Cadrage · Montage · Étalonnage",
  "Captation live": "Cadre multicaméra · Montage événementiel",
  Documentaire: "Image · Montage · Narration visuelle",
  "Film événementiel": "Cadrage · Montage · Direction du rythme",
  "Clip officiel": "Cadrage · Montage · Traitement de l’image",
};

const starterProjects: Project[] = [
  {
    id: "lumafest-2",
    title: "LUMAFEST 2",
    category: "Captation live",
    year: "2026",
    description: "Une immersion événementielle qui transforme l’énergie du public, les artistes et les lumières en film vivant — pensé pour donner envie de vivre l’événement.",
    image: "/media/JK_PROD_LUMAFEST2_POSTER_7ebb4c1c.jpg",
    videoUrl: "/media/JK_PROD_LUMAFEST2_REC709_WEB_575a3f82.mp4",
  },
  {
    id: "ddk-concert",
    title: "DDK — Concert live",
    category: "Captation live",
    year: "2026",
    description: "Une captation rythmée qui restitue la puissance de la scène, la lumière et la connexion entre l’artiste et son public.",
    image: "/media/DDK-concert-best_8f6ae001.jpg",
    videoUrl: "/media/JK_PROD_DDK_CONCERT_REEL_60S_REC709_7add4d68.mp4",
  },
  {
    id: "unijed",
    title: "UNIJED Afrique",
    category: "Film institutionnel",
    year: "2026",
    description: "Un film institutionnel clair et humain pour faire comprendre une mission, valoriser une organisation et créer la confiance.",
    image: "/media/unijed-best_e8423e2f.jpg",
    videoUrl: "/media/JK_PROD_UNIJED_WEB_30S_REC709_9c189881.mp4",
  },
  {
    id: "mariage-ouedraogo",
    title: "Mariage Ouedraogo",
    category: "Film événementiel",
    year: "2026",
    description: "Un film émotionnel construit sur les regards, les détails et les instants forts pour conserver l’intensité d’une journée unique.",
    image: "/media/mariage-ouedraogo-best_c9855ef8.jpg",
    videoUrl: "/media/JK_PROD_WEDDING_REEL_60S_REC709_aacbbf67.mp4",
    detailImage: "/media/wedding-rings-detail_081b1a89.jpg",
  },
  {
    id: "nak-30-ans",
    title: "30 ans du NAK",
    category: "Film événementiel",
    year: "2026",
    description: "Un récit de festival qui mêle culture, public et transmission pour donner à une identité locale une image forte et mémorable.",
    image: "/media/nak-30-ans-best_7440ca94.jpg",
    videoUrl: "/media/JK_PROD_NAK_ANNIVERSAIRE_CANON_REEL_60S_REC709_ee814bb6.mp4",
  },
];

const navItems = [
  ["Accueil", "accueil"],
  ["Réalisations", "realisations"],
  ["Parcours", "parcours"],
  ["Compétences", "competences"],
  ["Contact", "contact"],
];

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#accueil" className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="JK Prod - Accueil">
      <span className="brand-monogram">JK</span>
      <span className="brand-wordmark">PROD <small>JEFFERSON KONE</small></span>
    </a>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return <p className="section-eyebrow"><span />{children}</p>;
}

const PROJECTS_STORAGE_KEY = "jkprod-projects-v2";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Film / vidéo",
    year: "2026",
    description: "",
    image: "",
    videoUrl: "",
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      try {
        const savedProjects = JSON.parse(saved) as Project[];
        const starterById = new Map(starterProjects.map((starter) => [starter.id, starter]));
        const updatedSavedProjects = savedProjects.map((savedProject) => starterById.get(savedProject.id) ? { ...savedProject, ...starterById.get(savedProject.id) } : savedProject);
        const missingStarterProjects = starterProjects.filter((starter) => !updatedSavedProjects.some((savedProject) => savedProject.id === starter.id));
        setProjects([...updatedSavedProjects, ...missingStarterProjects]);
      } catch {
        window.localStorage.removeItem(PROJECTS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const featuredProjects = useMemo(() => {
    const lumafest = projects.find((project) => project.id === "lumafest-2");
    if (!lumafest) return projects.slice(0, 5);
    return [lumafest, ...projects.filter((project) => project.id !== "lumafest-2")].slice(0, 5);
  }, [projects]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newProject.title.trim()) return;
    const project: Project = {
      id: `${Date.now()}`,
      title: newProject.title.trim(),
      category: newProject.category.trim() || "Film / vidéo",
      year: newProject.year.trim() || "2026",
      description: newProject.description.trim() || "Projet signé JK Prod.",
      image:
        newProject.image.trim() ||
        "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=82",
      videoUrl: newProject.videoUrl.trim() || "#",
    };
    setProjects((current) => [project, ...current]);
    setNewProject({ title: "", category: "Film / vidéo", year: "2026", description: "", image: "", videoUrl: "" });
  }

  return (
    <div className={`site-shell ${lightMode ? "theme-light" : ""}`}>
      <header className="site-header">
        <div className="header-inner">
          <LogoMark />
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navigation principale">
            {navItems.map(([label, id], index) => (
              <button key={id} className={index === 0 ? "is-active" : ""} onClick={() => scrollTo(id)}>
                <span>0{index + 1}</span>{label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-button" onClick={() => setLightMode((value) => !value)} aria-label="Changer de thème">
              {lightMode ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Ouvrir le menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section" id="accueil">
          <div className="hero-grid" />
          <div className="hero-orb hero-orb--one" />
          <div className="hero-orb hero-orb--two" />
          <div className="container hero-content">
            <div className="hero-copy reveal-up">
              <p className="hero-kicker"><span className="pulse-dot" /> Cadreur · Monteur · Vidéaste</p>
              <h1>Je capte<br /><em>l’essentiel.</em><br />Je raconte<br /><em>vos histoires.</em></h1>
              <p className="hero-description">Une image forte. Un montage précis.<br />Au service de vos projets audiovisuels.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => setShowreelOpen(true)}><Play size={16} fill="currentColor" /> Voir le showreel</button>
                <a className="hero-whatsapp" href="https://wa.me/22660425060" target="_blank" rel="noreferrer"><MessageCircle size={16} /> Discuter sur WhatsApp</a>
                <button className="text-link" onClick={() => scrollTo("realisations")}>Explorer les réalisations <ArrowUpRight size={16} /></button>
              </div>
            </div>
            <div className="hero-visual reveal-in">
              <div className="camera-frame">
                <div className="camera-lens" />
                <div className="camera-body"><span>CANON</span><small>5D MARK IV</small></div>
                <div className="camera-handle" />
                <div className="camera-matte" />
              </div>
              <div className="hero-image-placeholder">
                <span className="vertical-label">OUAGADOUGOU / BURKINA FASO</span>
                <div className="frame-glow" />
              </div>
              <div className="hero-side-note"><span>01</span><i /> Une autre<br />façon de voir.</div>
              <button className="hero-reel-card" onClick={() => setShowreelOpen(true)}><span className="reel-card-icon"><Play size={13} fill="currentColor" /></span><span><small>Showreel / 2026</small><strong>Le regard JK Prod</strong></span><ArrowUpRight size={15} /></button>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>Scroll pour découvrir</span><ArrowDownRight size={18} />
            <div className="hero-signature">JK<span>PROD</span></div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Repères JK Prod">
          <div className="container trust-strip-inner">
            <div><strong>05</strong><span>réalisations<br />sélectionnées</span></div>
            <div><strong>REC.709</strong><span>image soignée<br />et prête à diffuser</span></div>
            <div><strong>BF</strong><span>Ouagadougou<br />et projets à distance</span></div>
          </div>
        </section>

        <section className="work-section section-pad" id="realisations">
          <div className="container">
            <div className="section-heading split-heading">
              <div><SectionEyebrow>01 / Réalisations</SectionEyebrow><h2>Une sélection<br /><em>de réalisations.</em></h2></div>
              <div className="heading-aside"><p>Des images qui servent<br />une intention. Chaque plan,<br />chaque coupe compte.</p></div>
            </div>
            <div className="project-grid">
              {featuredProjects.map((project, index) => (
                <article className={`project-card project-card--${index + 1}`} key={project.id}>
                  <div className="project-image-wrap">
                    <img src={project.image} alt={`Image du projet ${project.title}`} loading="lazy" />
                    <div className="project-overlay" />
                    <span className="project-index">0{index + 1}</span>
                    {project.videoUrl && project.videoUrl !== "#" ? <a className="play-button" href={project.videoUrl} target="_blank" rel="noreferrer" aria-label={`Voir ${project.title}`}><Play size={15} fill="currentColor" /></a> : <span className="play-button play-button--muted"><Play size={15} fill="currentColor" /></span>}
                    <button className="project-caption" onClick={() => setActiveProject(project)}><span>{project.category}</span><h3>{project.title}</h3><small>{project.year} · Découvrir le projet <ChevronRight size={12} /></small></button>
                  </div>
                </article>
              ))}
            </div>
            <div className="section-footer"><span>{projects.length} projets affichés</span><span className="detail-note">Nouvelles réalisations sur demande</span></div>
          </div>
        </section>

        <section className="statement-section">
          <div className="container statement-inner">
            <div className="statement-number">02</div>
            <div className="statement-copy"><SectionEyebrow>La signature JK Prod</SectionEyebrow><p>Je ne filme pas seulement ce qui se passe.<br /><strong>Je cherche ce que ça fait ressentir.</strong></p></div>
            <Clapperboard className="statement-icon" size={48} strokeWidth={1} />
          </div>
        </section>

        <section className="about-section section-pad" id="a-propos">
          <div className="container about-grid">
            <div className="about-label"><SectionEyebrow>03 / À propos</SectionEyebrow><span className="about-stamp">JK<br /><small>PROD</small></span></div>
            <figure className="about-main-portrait"><img src="/media/jefferson-portrait-highres_b22534a5.webp" alt="Jefferson KONE, cadreur-monteur et vidéaste" /><figcaption><span>JEFFERSON KONE</span><strong>Le regard derrière la caméra.</strong></figcaption></figure>
            <div className="about-content"><h2>L’image comme<br /><em>langage.</em></h2><p className="about-lead">Je m’appelle <strong>Jefferson KONE</strong>, cadreur-monteur et vidéaste basé à Ouagadougou, au Burkina Faso.</p><p>Passionné par l’image et la narration audiovisuelle, je transforme les idées, les événements et les histoires en contenus visuels vivants, précis et mémorables.</p><p>Mon expérience chez Showtools Experience Burkina et We Are Group m’a permis de participer à des films institutionnels, des captations d’événements, des documentaires, des clips et des contenus de communication.</p><blockquote>Une image forte.<br /><strong>Un montage précis. Une histoire qui reste.</strong></blockquote><button className="text-link" onClick={() => scrollTo("contact")}>Travaillons ensemble <ArrowUpRight size={16} /></button></div>
          </div>
        </section>

        <section className="journey-section section-pad" id="parcours">
          <div className="container journey-grid">
            <div className="portrait-panel about-photo-collage">
              <figure className="about-photo about-photo--portrait"><img src="/media/jefferson-portrait-highres_b22534a5.webp" alt="Portrait de Jefferson KONE avec sa caméra et son stabilisateur" /><figcaption><span>01 / IDENTITÉ</span><strong>Le regard avant l’image.</strong></figcaption></figure>
              <figure className="about-photo about-photo--field"><img src="/media/jefferson-field-retouched_a9bff046.webp" alt="Jefferson KONE en tournage extérieur avec un stabilisateur" /><figcaption><span>02 / TERRAIN</span><strong>La maîtrise en mouvement.</strong></figcaption></figure>
              <div className="about-photo-signature"><span>JK PROD</span><small>CADREUR · MONTEUR · VIDÉASTE</small></div>
            </div>
            <div className="journey-copy">
              <SectionEyebrow>04 / Parcours</SectionEyebrow>
              <h2>Expérience.<br /><em>Engagement.</em><br />Exigence.</h2>
              <p className="lead-copy">Passionné par l’image depuis plusieurs années, j’ai choisi d’en faire mon métier. Mon parcours se construit au fil des tournages, avec le même objectif : donner du sens à chaque image.</p>
              <div className="timeline">
                <div className="timeline-item"><span>01</span><div><strong>Showtools Experience Burkina</strong><small>Assistant cadreur — monteur</small></div><time>Expérience</time></div>
                <div className="timeline-item"><span>02</span><div><strong>We Are Group</strong><small>Assistant cadreur — monteur</small></div><time>Expérience</time></div>
                <div className="timeline-item timeline-item--active"><span>03</span><div><strong>Freelance / JK Prod</strong><small>Cadreur — monteur indépendant</small></div><time>Aujourd’hui</time></div>
              </div>
              <div className="cv-downloads"><a className="outline-button" href="/media/CV-Jefferson-KONE-ATS-Audiovisuel_04650878.pdf" target="_blank" rel="noreferrer" download="CV-Jefferson-KONE-ATS-Audiovisuel.pdf"><Download size={16} /> CV ATS audiovisuel</a><a className="text-link" href="/media/main_c82a976b.pdf" target="_blank" rel="noreferrer" download="CV-Jefferson-KONE.pdf">CV portfolio visuel <ExternalLink size={15} /></a></div>
            </div>
          </div>
        </section>

        <section className="skills-section section-pad" id="competences">
          <div className="container">
            <div className="section-heading split-heading"><div><SectionEyebrow>05 / Outils & savoir-faire</SectionEyebrow><h2>Le regard,<br /><em>la maîtrise.</em></h2></div><p className="heading-note">Du premier repérage<br />à la dernière exportation.</p></div>
            <div className="skills-layout">
              <div className="skill-list">
                {[['Cadrage & composition', Camera], ['Montage vidéo', Scissors], ['Étalonnage', Palette], ['Prise de son', MessageCircle], ['Direction artistique', Sparkles]].map(([label, Icon], index) => {
                  const IconComponent = Icon as typeof Camera;
                  return <div className="skill-row" key={label as string}><IconComponent size={17} /><span>{label as string}</span><div className="skill-line"><i style={{ width: `${86 - index * 7}%` }} /></div><b>{86 - index * 7}%</b></div>;
                })}
              </div>
              <div className="tool-stack"><p>Outils maîtrisés</p><div className="tool-cards"><span title="Canva">Ca</span><span title="Adobe Premiere Pro">Pr</span><span title="Adobe After Effects">Ae</span><span title="Adobe Lightroom">Lr</span><span title="Outils d’intelligence artificielle">IA</span></div><div className="gear-note"><Film size={19} /><span>Canva, montage, retouche et IA<br />au service d’une image juste.</span></div></div>
            </div>
          </div>
        </section>

        <section className="numbers-section"><div className="container numbers-grid"><div><strong>PLUSIEURS</strong><span>projets réalisés</span></div><div><strong>3</strong><span>expériences fortes</span></div><div><strong>100%</strong><span>engagement</span></div><div><strong>BF</strong><span>basé à Ouagadougou</span></div></div></section>

        <section className="contact-section section-pad" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy"><SectionEyebrow>06 / Contact</SectionEyebrow><h2>Un projet<br /><em>en tête ?</em></h2><p>Parlons de votre idée, de votre événement ou de votre prochaine histoire à raconter.</p><div className="contact-location"><MapPin size={17} /><span>Ouagadougou, Burkina Faso<br /><small>Disponible pour des projets locaux et à distance.</small></span></div></div>
            <div className="contact-cards">
              <a href="https://wa.me/22660425060" className="contact-card" target="_blank" rel="noreferrer"><MessageCircle size={20} /><span>WhatsApp</span><strong>+226 60 42 50 60</strong><ArrowUpRight size={16} /></a>
              <a href="tel:+22667594660" className="contact-card"><Phone size={20} /><span>Téléphone</span><strong>+226 67 59 46 60</strong><ArrowUpRight size={16} /></a>
              <a href="mailto:jkprod226@gmail.com" className="contact-card"><Mail size={20} /><span>Email</span><strong>jkprod226@gmail.com</strong><ArrowUpRight size={16} /></a>
              <a href="https://www.tiktok.com/@jk_prod1" className="contact-card" target="_blank" rel="noreferrer"><span className="social-letter">Tk</span><span>TikTok</span><strong>@jk_prod1</strong><ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="container contact-footer"><LogoMark compact /><div className="social-links"><a href="https://www.tiktok.com/@jk_prod1" target="_blank" rel="noreferrer">TikTok</a><a href="https://www.facebook.com/share/1cW8BnfyB3/" target="_blank" rel="noreferrer">Facebook</a><a href="mailto:jkprod226@gmail.com">Email</a></div><span className="copyright">© 2026 JK Prod — Jefferson KONE</span></div>
        </section>
      </main>

      {showreelOpen && <div className="studio-backdrop" role="dialog" aria-modal="true" aria-label="Showreel JK Prod"><div className="showreel-panel"><button className="studio-close" onClick={() => setShowreelOpen(false)} aria-label="Fermer"><X size={20} /></button><div className="showreel-video-wrap"><video controls preload="metadata" playsInline poster="/media/JK_PROD_LUMAFEST2_POSTER_7ebb4c1c.jpg" src="/media/JK_PROD_SHOWREEL_CINEMA_PREMIUM_27S_3670eeac.mp4" /></div><div className="showreel-footer"><span><strong>JK Prod — Cinema Premium.</strong> Un montage sobre et immersif qui relie scène, culture, transmission et émotion avec une image étalonnée Rec.709.</span><div className="showreel-links"><a className="text-link" href="/media/JK_PROD_SHOWREEL_CINEMA_PREMIUM_27S_3670eeac.mp4" target="_blank" rel="noreferrer" download="JK-PROD-SHOWREEL-CINEMA-PREMIUM-27S.mp4">Télécharger le showreel <ExternalLink size={15} /></a><button className="outline-button" onClick={() => { setShowreelOpen(false); scrollTo("contact"); }}>Parlons de votre projet <ArrowUpRight size={15} /></button></div></div></div></div>}

      {activeProject && <div className="studio-backdrop" role="dialog" aria-modal="true" aria-label={`Projet ${activeProject.title}`}><div className="project-detail-panel"><button className="studio-close" onClick={() => setActiveProject(null)} aria-label="Fermer"><X size={20} /></button><div className="project-detail-image"><img src={activeProject.image} alt="" /><span>{activeProject.year}</span></div><div className="project-detail-copy"><SectionEyebrow>{activeProject.category}</SectionEyebrow><h2>{activeProject.title}</h2><p className="project-role">{projectRoles[activeProject.category] || "Image · Montage · Direction artistique"}</p><p>{activeProject.description}</p>{activeProject.detailImage && <img className="project-detail-still" src={activeProject.detailImage} alt="Détail visuel du projet" />}{activeProject.videoUrl && activeProject.videoUrl.startsWith("/media/") && <div className="project-detail-video"><video controls preload="metadata" playsInline poster={activeProject.image} src={activeProject.videoUrl} /></div>}<div className="project-detail-actions">{activeProject.videoUrl && activeProject.videoUrl !== "#" ? (activeProject.videoUrl.startsWith("/media/") ? <span className="detail-note">Lecture directe — réalisation JK Prod</span> : <a className="primary-button" href={activeProject.videoUrl} target="_blank" rel="noreferrer"><Play size={15} fill="currentColor" /> Voir la vidéo</a>) : <button className="outline-button" onClick={() => { setActiveProject(null); setStudioOpen(true); }}>Ajouter le lien vidéo <ExternalLink size={15} /></button>}<span className="detail-note">Projet présenté par JK Prod</span></div></div></div></div>}

      {studioOpen && <div className="studio-backdrop" role="dialog" aria-modal="true" aria-label="Studio JK">
        <div className="studio-panel">
          <button className="studio-close" onClick={() => setStudioOpen(false)} aria-label="Fermer"><X size={20} /></button>
          <SectionEyebrow>Studio JK / Gestion locale</SectionEyebrow>
          <h2>Ajouter une <em>réalisation.</em></h2>
          <p className="studio-intro">Ajoutez un projet sans toucher au code. Les informations sont enregistrées dans ce navigateur uniquement, en attendant une version connectée.</p>
          <form onSubmit={handleProjectSubmit} className="studio-form">
            <label>Nom du projet<input required value={newProject.title} onChange={(event) => setNewProject({ ...newProject, title: event.target.value })} placeholder="Ex. Film institutionnel" /></label>
            <div className="form-row"><label>Catégorie<input value={newProject.category} onChange={(event) => setNewProject({ ...newProject, category: event.target.value })} placeholder="Documentaire" /></label><label>Année<input value={newProject.year} onChange={(event) => setNewProject({ ...newProject, year: event.target.value })} placeholder="2026" /></label></div>
            <label>Description<textarea value={newProject.description} onChange={(event) => setNewProject({ ...newProject, description: event.target.value })} placeholder="Une phrase sur le projet" rows={3} /></label>
            <label>URL de la miniature <small>Optionnel — image hébergée</small><input value={newProject.image} onChange={(event) => setNewProject({ ...newProject, image: event.target.value })} placeholder="https://..." /></label>
            <label>Lien vidéo <small>YouTube, Vimeo ou autre</small><input value={newProject.videoUrl} onChange={(event) => setNewProject({ ...newProject, videoUrl: event.target.value })} placeholder="https://youtube.com/..." /></label>
            <button className="primary-button" type="submit"><Check size={16} /> Enregistrer le projet</button>
          </form>
          <div className="studio-note"><ExternalLink size={15} /><span>Pour publier une vidéo locale, mettez-la d’abord sur YouTube ou Vimeo, puis collez son lien ici. Cela évite de ralentir votre site.</span></div>
        </div>
      </div>}
    </div>
  );
}

export default Home;
