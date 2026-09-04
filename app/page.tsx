const sitePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const mediaUrl = (fileName: string) => `${sitePath}/media/${fileName}`;

const workItems = [
  {
    number: '01',
    title: 'Lathmar: The Fallen Depths',
    kind: 'Dark fantasy roleplaying game',
    text: 'A living underworld of bargains, old wounds, and cities built over things that never truly died. Lathmar is a roleplaying game about entering the dark with a lantern, a party, and no certainty of return.',
    image: mediaUrl('lathmar.jpg'),
    tone: 'lathmar',
  },
  {
    number: '02',
    title: 'War of the Wizards',
    kind: 'A Chaos remake in 8-bit spirit',
    text: 'A small screen. A hostile kingdom. A duel of summoners where one good spell can change the whole map. War of the Wizards revisits old-school tactical fantasy with sharp pixels and crooked magic.',
    image: mediaUrl('wizards-poster.png'),
    tone: 'wizards',
  },
  {
    number: '03',
    title: 'Routes of Africa',
    kind: 'Historical expedition strategy',
    text: 'Plan a scientific expedition through nineteenth-century North and Central Africa. Follow routes, negotiate, listen, document, and return with records that can be tested. The world is not unknown; it is only missing from one map.',
    image: mediaUrl('north-africa.jfif'),
    tone: 'africa',
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Sabnock Works home">
          <span className="wordmark-mark">S</span>
          <span>Sabnock Works</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#works">Works</a>
          <a href="#tabletop">Tabletop</a>
          <a href="#stories">Stories</a>
          <a href={`${sitePath}/imprint/`}>Imprint</a>
        </nav>
        <a className="header-link" href="#works">Enter the archive</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true">
          <img src={mediaUrl('lathmar.jpg')} alt="" />
        </div>
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Independent game studio</p>
          <h1>
            Old souls.<br />
            <em>New tools.</em><br />
            Strange routes and fallen worlds.
          </h1>
          <p className="hero-intro">
            Sabnock Works on games, roleplaying material, and short fiction
            for people who still keep a map folded in their pocket.
          </p>
          <a className="button button-primary" href="#works">Explore the works <span aria-hidden="true">&#8595;</span></a>
        </div>
        <img className="hero-seal" src={mediaUrl('sabnock-seal-alpha.png')} alt="Sabnock Works brass maker's seal" />
        <p className="hero-note">Scroll for the cabinet of curious things</p>
      </section>

      <section className="works-section" id="works">
        <div className="section-heading">
          <p className="eyebrow">The works</p>
          <h2>Three worlds in progress.</h2>
          <p>Each begins with a different kind of map.</p>
        </div>
        <div className="work-list">
          {workItems.map((work) => (
            <article className={`work-card work-card-${work.tone}`} key={work.number}>
              <div className="work-number">{work.number}</div>
              <div className="work-copy">
                <p className="work-kind">{work.kind}</p>
                <h3>{work.title}</h3>
                <p>{work.text}</p>
                <a href={`#${work.tone}`}>Open the case <span aria-hidden="true">&#8594;</span></a>
              </div>
              <div className="work-image-wrap" id={work.tone}>
                <img className="work-image" src={work.image} alt="" />
                {work.tone === 'wizards' && (
                  <>
                    <img className="sprite sprite-red" src={mediaUrl('red-dragon.png')} alt="" />
                    <img className="sprite sprite-hydra" src={mediaUrl('hydra.png')} alt="" />
                  </>
                )}
                <span className="image-label">{work.tone === 'africa' ? 'Field map / North Africa' : 'From the workshop archive'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="free-shelf" id="tabletop">
        <div className="shelf-rune" aria-hidden="true">D20</div>
        <div className="shelf-copy">
          <p className="eyebrow">The open drawer</p>
          <h2>Free tabletop material.</h2>
          <p>
            Rules fragments, encounter tools, odd creatures, and gameable
            places for the tables that keep going long after midnight. Built to
            be lifted, marked up, and made your own.
          </p>
          <span className="coming-soon">First files are being prepared</span>
        </div>
        <div className="shelf-index" aria-label="Material categories">
          <span>01 Rules</span><span>02 Creatures</span><span>03 Places</span><span>04 Tables</span>
        </div>
      </section>

      <section className="stories-section" id="stories">
        <div className="story-orbit" aria-hidden="true">
          <span>Fiction</span><span>Fiction</span><span>Fiction</span><span>Fiction</span>
        </div>
        <div className="stories-copy">
          <p className="eyebrow">From the loose pages</p>
          <h2>Free short stories.</h2>
          <p>
            Brief descents into other rooms: ruined courts, uncertain roads,
            people who have found the wrong door, and the price they pay for
            opening it.
          </p>
          <span className="coming-soon">The first pages will appear here</span>
        </div>
      </section>

      <footer>
        <div className="footer-mark"><span>S</span><p>Sabnock Works<br />Independent Game Studio</p></div>
        <a className="footer-imprint-link" href={`${sitePath}/imprint/`}>Imprint</a>
        <p className="footer-end">Old souls. New tools.<br />Keep the lantern lit.</p>
      </footer>
    </main>
  );
}
