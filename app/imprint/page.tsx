const sitePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function ImprintPage() {
  return (
    <main className="imprint-page">
      <header className="site-header">
        <a className="wordmark" href={`${sitePath}/`} aria-label="Sabnock Works home">
          <span className="wordmark-mark">S</span>
          <span>Sabnock Works</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={`${sitePath}/#works`}>Works</a>
          <a href={`${sitePath}/#tabletop`}>Tabletop</a>
          <a href={`${sitePath}/#stories`}>Stories</a>
          <a href={`${sitePath}/imprint/`}>Imprint</a>
        </nav>
        <a className="header-link" href={`${sitePath}/`}>Back to the archive</a>
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
          <a className="imprint-back" href={`${sitePath}/`}>Return to the works <span aria-hidden="true">&#8592;</span></a>
        </div>
      </section>
    </main>
  );
}
