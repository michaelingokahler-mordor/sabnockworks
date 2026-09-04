export default function ImprintPage() {
  return (
    <main className="imprint-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Sabnock Works home">
          <span className="wordmark-mark">S</span>
          <span>Sabnock Works</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/#works">Works</a>
          <a href="/#tabletop">Tabletop</a>
          <a href="/#stories">Stories</a>
          <a href="/imprint">Imprint</a>
        </nav>
        <a className="header-link" href="/">Back to the archive</a>
      </header>
      <section className="imprint-sheet">
        <div className="imprint-sheet-inner">
          <p className="eyebrow">Sabnock Works</p>
          <h1>Imprint</h1>
          <address>
            Michael Kahler<br />
            Sabnock Works<br />
            Kattrepel 7<br />
            27404 Zeven<br />
            Germany
          </address>
          <a className="imprint-back" href="/">Return to the works <span aria-hidden="true">&#8592;</span></a>
        </div>
      </section>
    </main>
  );
}
