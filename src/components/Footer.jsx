function Footer() {
  const whatsappLink = "https://wa.me/5511964181200";
  const instagramLink = "https://www.instagram.com/bourachedalimentos/";
  const anoAtual = new Date().getFullYear();
  const endereco = "Rua do Lucas, 306 - Brás, São Paulo - SP";
  const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&z=16&output=embed`;
  const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;

  return (
    <footer
      className="site-footer"
      aria-label="Rodape com informacoes de contato"
    >
      <div className="site-footer-inner">
        <section
          className="footer-col footer-brand"
          aria-label="Marca Bourached"
        >
          <img
            src="/logo-bourached-branco.png"
            alt="Logo da Bourached"
            className="footer-logo"
          />
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Instagram Bourached alimentos"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2zm0 1.8A3.96 3.96 0 0 0 3.8 7.75v8.5a3.96 3.96 0 0 0 3.95 3.95h8.5a3.96 3.96 0 0 0 3.95-3.95v-8.5a3.96 3.96 0 0 0-3.95-3.95h-8.5zM12 7.6A4.4 4.4 0 1 1 7.6 12 4.41 4.41 0 0 1 12 7.6zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4zm4.7-2.26a1.06 1.06 0 1 1-1.06 1.06 1.06 1.06 0 0 1 1.06-1.06z" />
            </svg>
            <span>@bourachedalimentos</span>
          </a>
        </section>

        <section className="footer-col" aria-label="Fale conosco">
          <h3>Fale conosco</h3>
          <p>
            WhatsApp:{" "}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              (11) 96418-1200
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              Bourached alimentos
            </a>
            </p>    
            <p>
             Email:{" "}
            <a
              href="mailto:bourachedalimentos@gmail.com"
                target="_blank"                rel="noopener noreferrer"
            >
              bourachedalimentos@gmail.com
            </a>
          </p>
        </section>

        <section className="footer-col" aria-label="Atendimento">
          <h3>Atendimento</h3>
          <p>Rua do Lucas 306, Brás</p>
          <p>Seg a Sex: 06:00 as 16:30</p>
          <p>
            <a href={mapaLink} target="_blank" rel="noopener noreferrer">
              Como chegar
            </a>
          </p>
          <div className="footer-mapa">
            <iframe
              src={mapaEmbed}
              title="Mapa: Bourached na Rua do Lucas 306, Brás"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <section className="footer-col" aria-label="Pagamentos">
          <h3>Pague com</h3>
          <div
            className="footer-badges"
            role="list"
            aria-label="Formas de pagamento"
          >
            <span role="listitem">Pix</span>
            <span role="listitem">Dinheiro</span>
          </div>
        </section>
      </div>

      <div className="site-footer-bottom" aria-label="Creditos e direitos">
        <p>
          &copy; {anoAtual} Bourached Alimentos | CNPJ: 32.955.752/0001-00 |
          Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;
