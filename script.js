/* ==========================================================================
   Pura Pieza — interacciones
   Sin dependencias. Todo vanilla, todo en español.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Datos de contacto — cambiá estos dos valores y listo. */
  const WHATSAPP = '50600000000';           // número en formato internacional, sin +
  const CORREO   = 'hola@purapieza.cr';

  /* Separador de miles con punto, como se escribe en Costa Rica.
     No usamos toLocaleString: según el ICU del navegador mete un espacio fino. */
  const miles   = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const colones = n => '₡' + miles(n);

  /* ---------------------------------------------------------------- 1. Tema */
  (function tema() {
    const raiz  = document.documentElement;
    const boton = $('#themeToggle');
    let guardado = null;
    try { guardado = localStorage.getItem('purapieza-tema'); } catch (e) { /* modo privado */ }
    if (guardado) raiz.setAttribute('data-theme', guardado);

    boton.addEventListener('click', () => {
      const oscuroAhora = raiz.getAttribute('data-theme')
        ? raiz.getAttribute('data-theme') === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nuevo = oscuroAhora ? 'light' : 'dark';
      raiz.setAttribute('data-theme', nuevo);
      try { localStorage.setItem('purapieza-tema', nuevo); } catch (e) { /* nada */ }
    });
  })();

  /* ------------------------------------------------------------- 2. Menú móvil */
  (function menu() {
    const burger = $('#burger');
    const links  = $('.nav__links');
    if (!burger) return;

    burger.addEventListener('click', () => {
      const abierto = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!abierto));
      burger.setAttribute('aria-label', abierto ? 'Abrir menú' : 'Cerrar menú');
      links.classList.toggle('is-open', !abierto);
    });

    links.addEventListener('click', e => {
      if (e.target.tagName !== 'A') return;
      burger.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    });
  })();

  /* ------------------------------------------------------- 3. Reveal al hacer scroll */
  (function reveal() {
    const items = $$('.reveal');
    if (menosMovimiento || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    items.forEach(el => obs.observe(el));
  })();

  /* ------------------------------------------------- 4. Contadores del hero */
  (function contadores() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    const animar = el => {
      const meta = Number(el.dataset.count);
      if (menosMovimiento) { el.textContent = miles(meta); return; }
      const dur = 1400;
      let inicio = null;
      const paso = t => {
        if (inicio === null) inicio = t;
        const p = Math.min((t - inicio) / dur, 1);
        const suave = 1 - Math.pow(1 - p, 3);
        el.textContent = miles(meta * suave);
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(animar); return; }
    const obs = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        animar(en.target);
        obs.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(el => obs.observe(el));
  })();

  /* --------------------------------------------------- 5. Catálogo y filtros
     edades: en qué tramos sirve. cats: a qué familias pertenece.
     Los juguetes de menos de 3 años van marcados con pieza:'única'. */
  const CHUNCHES = [
    /* --- Bebés: estimulación temprana y sensorial --- */
    {
      nombre: 'Móvil Munari de Contrastes',
      desc: 'Blanco y negro puro, lo único que el recién nacido logra enfocar. Gira con la corriente de aire.',
      precio: 14500, emoji: '⬛', edades: ['0-6m'], edadTxt: '0–3 m',
      cats: ['temprana', 'montessori'], color: '#7c5cff', unica: true,
      etiquetas: ['Enfoque visual', 'Va colgado']
    },
    {
      nombre: 'Sonaja Aro Gigante',
      desc: 'Un aro liviano que la mano entera puede agarrar, justo cuando descubre que tiene manos.',
      precio: 6900, emoji: '⭕', edades: ['0-6m', '6-12m'], edadTxt: '3–9 m',
      cats: ['temprana', 'sensorial'], color: '#ff5da8', unica: true,
      etiquetas: ['Agarre palmar', 'Sonido suave']
    },
    {
      nombre: 'Pelota Sensorial Calada',
      desc: 'Calada para que los dedos entren y rueda despacio, para que gatee detrás sin frustrarse.',
      precio: 7500, emoji: '🔮', edades: ['6-12m', '12-24m'], edadTxt: '6–15 m',
      cats: ['sensorial', 'desarrollo'], color: '#12b0c9', unica: true,
      etiquetas: ['Agarre a dos manos', 'Gateo']
    },
    {
      nombre: 'Cascabel de Texturas',
      desc: 'Cuatro superficies distintas en una sola pieza: lisa, acanalada, rugosa y con hoyitos.',
      precio: 8200, emoji: '🫧', edades: ['6-12m'], edadTxt: '6–12 m',
      cats: ['sensorial', 'temprana'], color: '#ffb703', unica: true,
      etiquetas: ['Tacto', 'Causa y efecto']
    },

    /* --- Gateo y primeros pasos --- */
    {
      nombre: 'Cubo de Permanencia',
      desc: 'La bola entra por arriba y aparece por la gaveta. El clásico Montessori del año.',
      precio: 13900, emoji: '🎲', edades: ['6-12m', '12-24m'], edadTxt: '10–18 m',
      cats: ['montessori', 'desarrollo'], color: '#12b06a', unica: true,
      etiquetas: ['Permanencia del objeto', 'Pinza fina']
    },
    {
      nombre: 'Encajable de Formas Gigantes',
      desc: 'Cuatro formas grandes y una sola manera de que entren. Se corrige solo, sin que le digan nada.',
      precio: 12500, emoji: '🔺', edades: ['12-24m'], edadTxt: '12–24 m',
      cats: ['didactico', 'desarrollo', 'montessori'], color: '#ff6b4a', unica: true,
      etiquetas: ['Formas', 'Control de error']
    },
    {
      nombre: 'Torre de Aros Graduada',
      desc: 'Cinco aros de mayor a menor. Ordenar por tamaño es la primera matemática de la vida.',
      precio: 11900, emoji: '🍩', edades: ['12-24m'], edadTxt: '12–24 m',
      cats: ['montessori', 'didactico'], color: '#12b0c9', unica: true,
      etiquetas: ['Seriación', 'Coordinación']
    },
    {
      nombre: 'Tabla de Botones y Broches',
      desc: 'Vida práctica: abrochar, desabrochar y volver a empezar. Entrenamiento puro para vestirse solo.',
      precio: 16500, emoji: '🧵', edades: ['24-36m', '3a'], edadTxt: '2–4 años',
      cats: ['montessori', 'desarrollo'], color: '#7c5cff',
      etiquetas: ['Vida práctica', 'Autonomía']
    },

    /* --- Preescolar --- */
    {
      nombre: 'Encajable de Animales Ticos',
      desc: 'Perezoso, tucán, rana y mono. Se encajan y se nombran: vocabulario mientras juega.',
      precio: 14900, emoji: '🦥', edades: ['24-36m', '3a'], edadTxt: '2–5 años',
      cats: ['didactico', 'desarrollo'], color: '#12b06a',
      etiquetas: ['Lenguaje', 'Fauna de CR']
    },
    {
      nombre: 'Rana Saltarina Articulada',
      desc: 'Sale impresa en una sola pieza y salta de verdad. Anatomía que se dobla en la mano.',
      precio: 6500, emoji: '🐸', edades: ['24-36m', '3a'], edadTxt: '2–5 años',
      cats: ['desarrollo', 'sensorial'], color: '#12b06a',
      etiquetas: ['Biología', 'Juego libre']
    },
    {
      nombre: 'Perezoso Fidget',
      desc: 'Se cuelga del bolso y gira despacito. Nuestro superventas sensorial.',
      precio: 5500, emoji: '🦥', edades: ['3a', '6a'], edadTxt: '3+ años',
      cats: ['sensorial'], color: '#12b0c9',
      etiquetas: ['Autorregulación', 'Portátil']
    },

    /* --- Escolar --- */
    {
      nombre: 'Cubo Infinito Tico',
      desc: 'Ocho piezas que giran sin fin. Imposible soltarlo en una reunión.',
      precio: 8500, emoji: '🧊', edades: ['6a'], edadTxt: '6+ años',
      cats: ['sensorial', 'desarrollo'], color: '#12b0c9',
      etiquetas: ['Motricidad fina', 'Concentración']
    },
    {
      nombre: 'Engranajes Locos',
      desc: 'Set planetario que se arma solo con las manos. Causa y efecto en vivo.',
      precio: 12900, emoji: '⚙️', edades: ['6a'], edadTxt: '7+ años',
      cats: ['didactico', 'desarrollo'], color: '#ffb703',
      etiquetas: ['Física', 'Mecánica']
    },
    {
      nombre: 'Torre de Fracciones',
      desc: 'Medios, tercios y quintos que encajan. Se entienden porque se tocan.',
      precio: 14500, emoji: '➗', edades: ['6a'], edadTxt: '8+ años',
      cats: ['didactico'], color: '#7c5cff',
      etiquetas: ['Fracciones', 'MEP 4.º–6.º']
    },
    {
      nombre: 'Dragón Flexi de Bolsillo',
      desc: '32 vértebras articuladas. Cabe en el bolsillo y aguanta la ansiedad.',
      precio: 9900, emoji: '🐉', edades: ['3a', '6a'], edadTxt: '5+ años',
      cats: ['sensorial'], color: '#ff6b4a',
      etiquetas: ['Fidget', 'Narrativa']
    },
    {
      nombre: 'Rompecabezas Volcán Arenal',
      desc: 'Doce capas geológicas que se apilan. Geografía tica en 3D.',
      precio: 11500, emoji: '🌋', edades: ['6a'], edadTxt: '8+ años',
      cats: ['didactico'], color: '#ff5da8',
      etiquetas: ['Geografía CR', 'Geometría']
    },
    {
      nombre: 'Laberinto de Canicas Modular',
      desc: 'Doce módulos que se reconfiguran. Ingeniería a punta de ensayo y error.',
      precio: 18900, emoji: '🌀', edades: ['6a'], edadTxt: '6+ años',
      cats: ['desarrollo', 'didactico'], color: '#ffb703',
      etiquetas: ['Ingeniería', 'Gravedad']
    }
  ];

  const NOMBRE_CAT = {
    temprana: 'Estimulación temprana', sensorial: 'Sensorial',
    didactico: 'Didáctico', desarrollo: 'Desarrollo', montessori: 'Montessori'
  };

  (function catalogo() {
    const grid   = $('#productGrid');
    const vacio  = $('#productEmpty');
    const conteo = $('#filterCount');
    if (!grid) return;

    grid.innerHTML = CHUNCHES.map(c => `
      <article class="product" data-edades="${c.edades.join(' ')}" data-cats="${c.cats.join(' ')}">
        <div class="product__art" style="--art:${c.color}">
          <span class="product__emoji" aria-hidden="true">${c.emoji}</span>
          <span class="product__age">${c.edadTxt}</span>
          ${c.unica ? '<span class="product__unica" title="Se imprime en una sola pieza, sin partes que se desprendan">🔒 Pieza única</span>' : ''}
        </div>
        <div class="product__body">
          <p class="product__cat">${c.cats.map(k => NOMBRE_CAT[k]).join(' · ')}</p>
          <h3 class="product__name">${c.nombre}</h3>
          <p class="product__desc">${c.desc}</p>
          <div class="product__tags">${c.etiquetas.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div class="product__foot">
            <p class="product__price">${colones(c.precio)}</p>
            <a class="btn btn--sm btn--primary" href="#contacto"
               data-pedir="${c.nombre}">Lo quiero</a>
          </div>
        </div>
      </article>
    `).join('');

    /* Red de seguridad para cuando se agreguen productos: si un juguete trae
       un tramo de edad o una familia que no existe entre los filtros, queda
       invisible en el catálogo sin que nadie se dé cuenta. Mejor avisar. */
    (function validar() {
      const validas = grupo => $$(`.chips[data-filter-group="${grupo}"] .chip`)
        .map(c => c.dataset.value).filter(v => v !== 'todas');
      const edadesOk = validas('edad'), catsOk = validas('categoria');
      CHUNCHES.forEach(c => {
        c.edades.filter(e => !edadesOk.includes(e)).forEach(e =>
          console.warn(`[Pura Pieza] "${c.nombre}" tiene la edad "${e}", que no está entre los filtros.`));
        c.cats.filter(k => !catsOk.includes(k)).forEach(k =>
          console.warn(`[Pura Pieza] "${c.nombre}" tiene la familia "${k}", que no está entre los filtros.`));
      });
    })();

    const estado = { edad: 'todas', categoria: 'todas' };

    const aplicar = () => {
      let visibles = 0;
      $$('.product', grid).forEach(card => {
        const edadOk = estado.edad === 'todas' ||
                       card.dataset.edades.split(' ').includes(estado.edad);
        const catOk  = estado.categoria === 'todas' ||
                       card.dataset.cats.split(' ').includes(estado.categoria);
        const mostrar = edadOk && catOk;
        card.hidden = !mostrar;
        if (mostrar) visibles++;
      });
      vacio.hidden = visibles > 0;
      conteo.textContent = visibles === 1
        ? '1 juguete encontrado'
        : `${visibles} juguetes encontrados`;
    };

    /* Permite que otras secciones pidan un filtro: los enlaces de familia
       y el botón "ver juguetes" de la guía por edad. */
    const marcar = (grupoClave, valor) => {
      const grupo = $(`.chips[data-filter-group="${grupoClave}"]`);
      if (!grupo) return;
      $$('.chip', grupo).forEach(c => {
        const activo = c.dataset.value === valor;
        c.classList.toggle('is-active', activo);
        c.setAttribute('aria-pressed', String(activo));
      });
      estado[grupoClave] = valor;
    };

    document.addEventListener('purapieza:filtrar', e => {
      marcar('edad', e.detail.edad || 'todas');
      marcar('categoria', e.detail.categoria || 'todas');
      aplicar();
    });

    $$('.chips[data-filter-group]').forEach(grupo => {
      const clave = grupo.dataset.filterGroup;
      grupo.addEventListener('click', e => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        $$('.chip', grupo).forEach(c => {
          const activo = c === chip;
          c.classList.toggle('is-active', activo);
          c.setAttribute('aria-pressed', String(activo));
        });
        estado[clave] = chip.dataset.value;
        aplicar();
      });
    });

    aplicar();

    /* "Lo quiero" prellena el formulario de abajo */
    grid.addEventListener('click', e => {
      const btn = e.target.closest('[data-pedir]');
      if (!btn) return;
      const texto = $('#orderForm [name="mensaje"]');
      if (texto) texto.value = `Me interesa el ${btn.dataset.pedir}. `;
    });
  })();

  /* ------------------------------------------- 5b. Guía de edad por meses */
  (function guia() {
    const panel = $('#guiaPanel');
    const barra = $('.guia__meses');
    if (!panel || !barra) return;

    const TRAMOS = {
      '0-3': {
        titulo: 'Recién llegado al mundo',
        hito: 'Enfoca apenas a 20–30 cm y sigue objetos lentos con la mirada. Todavía no agarra a voluntad: las manos van casi siempre cerradas.',
        buscar: 'Contraste extremo en blanco y negro, movimiento lento y sonidos suaves. Nada de colores pastel: todavía no los distingue.',
        cats: ['temprana', 'sensorial'],
        recos: ['Móvil Munari de Contrastes'],
        filtro: '0-6m'
      },
      '3-6': {
        titulo: 'Descubre que tiene manos',
        hito: 'Agarra lo que le pongan en la palma y se lo lleva directo a la boca. Empieza a sostener la cabeza y a interesarse por su propio reflejo.',
        buscar: 'Piezas livianas y grandes que la mano entera pueda rodear. Aquí arranca la etapa de todo-a-la-boca: pieza única, sin excepciones.',
        cats: ['sensorial', 'temprana'],
        recos: ['Sonaja Aro Gigante'],
        filtro: '0-6m'
      },
      '6-9': {
        titulo: 'Se sienta y experimenta',
        hito: 'Se sostiene sentado, pasa objetos de una mano a la otra y golpea todo para escuchar qué suena. Descubre que sus actos producen efectos.',
        buscar: 'Texturas encontradas en una misma pieza, sonido suave al moverse y formas que rueden despacio para invitar al gateo.',
        cats: ['sensorial', 'desarrollo'],
        recos: ['Cascabel de Texturas', 'Pelota Sensorial Calada'],
        filtro: '6-12m'
      },
      '9-12': {
        titulo: 'Llega la pinza fina',
        hito: 'Agarra con índice y pulgar, señala, y se obsesiona con meter y sacar cosas de recipientes. Entiende que lo que desaparece sigue existiendo.',
        buscar: 'Objetos que entren y salgan, tapas, gavetas. Es el momento exacto del cubo de permanencia.',
        cats: ['montessori', 'desarrollo'],
        recos: ['Cubo de Permanencia'],
        filtro: '6-12m'
      },
      '12-18': {
        titulo: 'Camina y encaja',
        hito: 'Camina, se agacha y vuelve a pararse. Apila, encaja y resuelve por ensayo y error, con una tolerancia a la frustración que crece cada semana.',
        buscar: 'Encajables de piezas grandes y torres de aros: una sola dificultad por juguete, para que el logro se vea claro.',
        cats: ['montessori', 'didactico'],
        recos: ['Encajable de Formas Gigantes', 'Torre de Aros Graduada'],
        filtro: '12-24m'
      },
      '18-24': {
        titulo: 'Explosión de palabras',
        hito: 'El vocabulario se dispara e imita todo lo que hacen los adultos. Empieza a jugar a "hacer como si".',
        buscar: 'Juguetes que se puedan nombrar: animales, objetos de la casa. Cada pieza es una palabra nueva.',
        cats: ['didactico', 'desarrollo'],
        recos: ['Encajable de Animales Ticos'],
        filtro: '12-24m'
      },
      '24-36': {
        titulo: '"¡Yo solo!"',
        hito: 'Quiere hacerlo todo sin ayuda. Clasifica por color y tamaño, vierte, abrocha y se enoja si le quitan la tarea de las manos.',
        buscar: 'Vida práctica: botones, broches, trasvases. Cosas de verdad, no versiones de juguete.',
        cats: ['montessori', 'desarrollo'],
        recos: ['Tabla de Botones y Broches', 'Rana Saltarina Articulada'],
        filtro: '24-36m'
      }
    };

    const ficha = (nombre) => {
      const c = CHUNCHES.find(x => x.nombre === nombre);
      if (!c) return '';
      return `
        <article class="reco">
          <span class="reco__emoji" style="--art:${c.color}" aria-hidden="true">${c.emoji}</span>
          <div>
            <h4>${c.nombre}</h4>
            <p>${c.etiquetas.join(' · ')}</p>
          </div>
          <p class="reco__precio">${colones(c.precio)}</p>
        </article>`;
    };

    const pintar = clave => {
      const t = TRAMOS[clave];
      panel.innerHTML = `
        <div class="guia__texto">
          <h3>${t.titulo}</h3>
          <div class="guia__bloque">
            <p class="guia__label">Qué está pasando</p>
            <p>${t.hito}</p>
          </div>
          <div class="guia__bloque">
            <p class="guia__label">Qué buscar</p>
            <p>${t.buscar}</p>
          </div>
          <div class="guia__cats">
            ${t.cats.map(k => `<span class="tag tag--${k}">${NOMBRE_CAT[k]}</span>`).join('')}
          </div>
        </div>
        <div class="guia__recos">
          <p class="guia__label">Lo que recomendamos</p>
          ${t.recos.map(ficha).join('')}
          <button class="btn btn--ghost btn--full" type="button" data-ver-edad="${t.filtro}">
            Ver todo lo de esta edad ↓
          </button>
        </div>`;
    };

    const botones = $$('.mes', barra);
    const activar = btn => {
      botones.forEach(b => {
        const activo = b === btn;
        b.classList.toggle('is-active', activo);
        b.setAttribute('aria-selected', String(activo));
        b.tabIndex = activo ? 0 : -1;
      });
      pintar(btn.dataset.mes);
    };

    barra.addEventListener('click', e => {
      const btn = e.target.closest('.mes');
      if (btn) activar(btn);
    });

    barra.addEventListener('keydown', e => {
      const i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      let destino = null;
      if (e.key === 'ArrowRight') destino = botones[(i + 1) % botones.length];
      if (e.key === 'ArrowLeft')  destino = botones[(i - 1 + botones.length) % botones.length];
      if (e.key === 'Home') destino = botones[0];
      if (e.key === 'End')  destino = botones[botones.length - 1];
      if (!destino) return;
      e.preventDefault();
      destino.focus();
      activar(destino);
    });

    /* "Ver todo lo de esta edad" filtra el catálogo y baja hasta él */
    panel.addEventListener('click', e => {
      const btn = e.target.closest('[data-ver-edad]');
      if (!btn) return;
      document.dispatchEvent(new CustomEvent('purapieza:filtrar', {
        detail: { edad: btn.dataset.verEdad, categoria: 'todas' }
      }));
      $('#productos').scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth' });
    });

    /* Los enlaces de la sección de familias filtran por categoría */
    $$('[data-ir-cat]').forEach(a => {
      a.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('purapieza:filtrar', {
          detail: { edad: 'todas', categoria: a.dataset.irCat }
        }));
      });
    });

    pintar('0-3');
  })();

  /* --------------------------------------------------- 6. Pestañas del lab */
  (function tabs() {
    const tablist = $('.lab__tabs');
    if (!tablist) return;
    const tabs = $$('.lab__tab', tablist);

    const activar = tab => {
      tabs.forEach(t => {
        const activo = t === tab;
        t.classList.toggle('is-active', activo);
        t.setAttribute('aria-selected', String(activo));
        t.tabIndex = activo ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !activo;
        panel.classList.toggle('is-active', activo);
      });
    };

    tablist.addEventListener('click', e => {
      const tab = e.target.closest('.lab__tab');
      if (tab) activar(tab);
    });

    tablist.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let destino = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   destino = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') destino = tabs[0];
      if (e.key === 'End')  destino = tabs[tabs.length - 1];
      if (!destino) return;
      e.preventDefault();
      destino.focus();
      activar(destino);
    });
  })();

  /* -------------------------------------------------------- 7. Fidget spinner */
  (function spinner() {
    const zona  = $('#spinnerHolder');
    const arms  = $('.spinner-arms');
    const rpmEl = $('#rpmValue');
    const barra = $('#rpmBar');
    const turnEl= $('#turnValue');
    const factoEl = $('#spinFact');
    if (!zona || !arms) return;

    const DATOS = [
      { min: 0,   texto: 'Un empujón le da <strong>momento angular</strong>: la energía que le pasaste con la mano ahora vive en el giro.' },
      { min: 60,  texto: 'Los tres lóbulos pesan igual. Si uno pesara más, el spinner vibraría en vez de girar parejo. Eso se llama <strong>balanceo</strong>.' },
      { min: 160, texto: 'No se detiene de golpe porque la <strong>inercia rotacional</strong> lo mantiene girando hasta que la fricción se come la energía.' },
      { min: 300, texto: '¡Vas volando! En un spinner real, casi toda la pérdida ocurre en el rodamiento del centro y en el roce con el aire.' },
      { min: 480, texto: 'A esta velocidad el borde recorre varios metros por segundo. Misma vuelta, distinta distancia: eso es <strong>velocidad tangencial</strong>.' }
    ];

    let angulo = 0;        // grados
    let velocidad = 0;     // grados / segundo
    let vueltas = 0;
    let acumulado = 0;
    let arrastrando = false;
    let anguloPrevio = 0;
    let tiempoPrevio = 0;
    let nivelDato = -1;

    const centro = () => {
      const r = zona.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const anguloDe = (e, c) => Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180 / Math.PI;

    const mostrarDato = rpm => {
      let nivel = 0;
      DATOS.forEach((d, i) => { if (rpm >= d.min) nivel = i; });
      if (nivel === nivelDato) return;
      nivelDato = nivel;
      $('.lab-fact__text', factoEl).innerHTML = DATOS[nivel].texto;
    };

    let ultimo = 0;
    const bucle = t => {
      const dt = ultimo ? Math.min((t - ultimo) / 1000, 0.05) : 0;
      ultimo = t;

      if (!arrastrando) {
        // fricción: un poco proporcional y un poco constante (rodamiento + aire)
        velocidad *= Math.pow(0.62, dt);
        const seco = 22 * dt;
        if (Math.abs(velocidad) <= seco) velocidad = 0;
        else velocidad -= Math.sign(velocidad) * seco;
        angulo += velocidad * dt;
      }

      acumulado += Math.abs(velocidad) * dt;
      while (acumulado >= 360) { acumulado -= 360; vueltas++; turnEl.textContent = vueltas; }

      arms.setAttribute('transform', `rotate(${angulo.toFixed(2)} 100 100)`);

      const rpm = Math.round(Math.abs(velocidad) / 6); // grados/s -> rpm
      rpmEl.textContent = rpm;
      barra.style.width = Math.min(100, rpm / 8) + '%';
      mostrarDato(rpm);

      requestAnimationFrame(bucle);
    };
    requestAnimationFrame(bucle);

    zona.addEventListener('pointerdown', e => {
      arrastrando = true;
      zona.setPointerCapture(e.pointerId);
      const c = centro();
      anguloPrevio = anguloDe(e, c);
      tiempoPrevio = e.timeStamp;
      velocidad = 0;
    });

    zona.addEventListener('pointermove', e => {
      if (!arrastrando) return;
      const c = centro();
      const a = anguloDe(e, c);
      let delta = a - anguloPrevio;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;

      const dt = Math.max((e.timeStamp - tiempoPrevio) / 1000, 0.008);
      angulo += delta;
      velocidad = delta / dt;
      anguloPrevio = a;
      tiempoPrevio = e.timeStamp;
    });

    const soltar = e => {
      if (!arrastrando) return;
      arrastrando = false;
      try { zona.releasePointerCapture(e.pointerId); } catch (err) { /* ya se soltó */ }
      velocidad = Math.max(-4000, Math.min(4000, velocidad));
    };
    zona.addEventListener('pointerup', soltar);
    zona.addEventListener('pointercancel', soltar);

    zona.addEventListener('keydown', e => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      velocidad = Math.min(4000, Math.abs(velocidad) + 900) * (velocidad < 0 ? -1 : 1);
    });
  })();

  /* ------------------------------------------------------- 8. Armá tu chunche */
  (function builder() {
    const svg = $('.builder__svg');
    if (!svg) return;

    const FORMAS = {
      cubo:      { nombre: 'Cubo Infinito',      base: 8500,  horas: '3 h 20 min', skill: 'Concentración y motricidad fina' },
      engranaje: { nombre: 'Engranaje Loco',     base: 12900, horas: '5 h 10 min', skill: 'Física de máquinas simples' },
      flexi:     { nombre: 'Flexi de Bolsillo',  base: 9900,  horas: '4 h 05 min', skill: 'Autorregulación y calma' },
      rompe:     { nombre: 'Rompecabezas Modular', base: 11500, horas: '4 h 45 min', skill: 'Razonamiento espacial' }
    };
    const COLORES = {
      '#12b0c9': 'Turquesa', '#ffb703': 'Mango', '#ff6b4a': 'Coral',
      '#12b06a': 'Selva',    '#7c5cff': 'Morado', '#ff5da8': 'Chicle'
    };
    const TEXTURAS = { liso: 0, capas: 600, rayas: 1200, puntos: 1200 };

    const estado = { forma: 'cubo', color: '#12b0c9', textura: 'liso' };

    /* dientes del engranaje, generados una sola vez */
    const dientes = $('#gearTeeth');
    if (dientes) {
      let html = '';
      for (let i = 0; i < 10; i++) {
        html += `<rect x="112" y="38" width="16" height="26" rx="4" class="bfill"
                  transform="rotate(${i * 36} 120 120)"/>`;
      }
      dientes.innerHTML = html;
    }

    const pintar = () => {
      /* toggleAttribute y no `.hidden`: los elementos SVG no implementan la
         propiedad hidden, así que asignarla no haría absolutamente nada. */
      $$('.bshape', svg).forEach(g => {
        g.toggleAttribute('hidden', g.id !== 'shape-' + estado.forma);
      });
      svg.style.setProperty('--pieza', estado.color);
      svg.style.setProperty(
        '--relleno',
        estado.textura === 'liso' ? 'var(--pieza)' : `url(#pat-${estado.textura})`
      );

      const f = FORMAS[estado.forma];
      $('#builderName').textContent  = `${f.nombre} ${COLORES[estado.color]}`;
      $('#builderSkill').textContent = f.skill;
      $('#builderTime').textContent  = '≈ ' + f.horas;
      $('#builderPrice').textContent = colones(f.base + TEXTURAS[estado.textura]);
    };

    $$('[data-build]').forEach(grupo => {
      const clave = grupo.dataset.build;
      grupo.addEventListener('click', e => {
        const btn = e.target.closest('.chip, .swatch');
        if (!btn) return;
        $$('.chip, .swatch', grupo).forEach(b => {
          const activo = b === btn;
          b.classList.toggle('is-active', activo);
          b.setAttribute('aria-pressed', String(activo));
        });
        estado[clave] = btn.dataset.value;
        pintar();
      });
    });

    $('#builderCta').addEventListener('click', () => {
      const texto = $('#orderForm [name="mensaje"]');
      if (texto) {
        texto.value = `Quiero cotizar un ${$('#builderName').textContent} ` +
                      `con textura ${estado.textura}. `;
      }
    });

    pintar();
  })();

  /* ----------------------------------------------------------- 9. Reto rápido */
  (function quiz() {
    const cont = $('#quiz');
    if (!cont) return;

    const PREGUNTAS = [
      {
        p: '¿De qué está hecho el filamento PLA con el que imprimimos?',
        ops: ['Petróleo puro', 'Almidón de maíz y caña', 'Vidrio molido', 'Caucho reciclado'],
        ok: 1,
        exp: 'El PLA sale de plantas como el maíz y la caña. Por eso es biodegradable en condiciones industriales.'
      },
      {
        p: 'Un cubo tiene 6 caras. ¿Cuántas <em>aristas</em> tiene?',
        ops: ['8', '10', '12', '16'],
        ok: 2,
        exp: '12 aristas, 8 vértices y 6 caras. Si sumás caras + vértices y restás aristas siempre da 2. ¡Eso es la fórmula de Euler!'
      },
      {
        p: '¿Cómo construye la impresora 3D una figura?',
        ops: ['Tallando un bloque sólido', 'Capa por capa desde abajo', 'Inflando plástico caliente', 'Prensando polvo en un molde'],
        ok: 1,
        exp: 'Se llama manufactura aditiva: se agrega material capa por capa, en vez de quitarlo como hace un torno.'
      },
      {
        p: 'Si un engranaje de 10 dientes mueve a otro de 20, el grande gira…',
        ops: ['Al doble de rápido', 'A la mitad de rápido', 'Igual de rápido', 'Al revés y más rápido'],
        ok: 1,
        exp: 'El doble de dientes = la mitad de vueltas, pero con el doble de fuerza. Así funciona el cambio de una bici.'
      },
      {
        p: 'Un fidget ayuda sobre todo a…',
        ops: ['Distraerse del todo', 'Canalizar la energía y sostener el foco', 'Dormirse más rápido', 'Hacer ejercicio'],
        ok: 1,
        exp: 'Ocupar las manos con un movimiento repetitivo libera energía sobrante y le deja espacio al cerebro para atender.'
      }
    ];

    const barra = $('#quizBar'), pasoEl = $('#quizStep'), totalEl = $('#quizTotal');
    const puntosEl = $('#quizScore'), cuerpo = $('#quizBody'), fin = $('#quizEnd');
    const preguntaEl = $('#quizQuestion'), opcionesEl = $('#quizOptions');
    const feedbackEl = $('#quizFeedback'), siguienteEl = $('#quizNext');

    let indice = 0, puntos = 0;
    totalEl.textContent = PREGUNTAS.length;

    const render = () => {
      const q = PREGUNTAS[indice];
      pasoEl.textContent = indice + 1;
      barra.style.width = (indice / PREGUNTAS.length * 100) + '%';
      preguntaEl.innerHTML = q.p;
      feedbackEl.hidden = true;
      siguienteEl.hidden = true;
      opcionesEl.innerHTML = q.ops.map((o, i) =>
        `<button class="quiz__option" type="button" data-i="${i}">${o}</button>`
      ).join('');
    };

    opcionesEl.addEventListener('click', e => {
      const btn = e.target.closest('.quiz__option');
      if (!btn || btn.disabled) return;

      const q = PREGUNTAS[indice];
      const elegida = Number(btn.dataset.i);
      const acerto = elegida === q.ok;
      if (acerto) { puntos++; puntosEl.textContent = puntos; }

      $$('.quiz__option', opcionesEl).forEach((b, i) => {
        b.disabled = true;
        if (i === q.ok) b.classList.add('is-right');
        else if (i === elegida) b.classList.add('is-wrong');
      });

      feedbackEl.innerHTML = (acerto ? '✅ <strong>¡Correcto!</strong> ' : '💡 <strong>Casi.</strong> ') + q.exp;
      feedbackEl.hidden = false;
      siguienteEl.hidden = false;
      siguienteEl.textContent = indice === PREGUNTAS.length - 1 ? 'Ver resultado 🏁' : 'Siguiente →';
      siguienteEl.focus();
    });

    siguienteEl.addEventListener('click', () => {
      indice++;
      if (indice < PREGUNTAS.length) { render(); return; }

      barra.style.width = '100%';
      cuerpo.hidden = true;
      fin.hidden = false;

      const r = [
        { min: 5, emoji: '🏆', t: '¡Sos un crack!',       m: 'Cinco de cinco. Deberías estar diseñando chunches con nosotros.' },
        { min: 3, emoji: '🎉', t: '¡Qué chiva!',           m: 'Muy bien. Con un chunche en la mano el resto se aprende solo.' },
        { min: 0, emoji: '🌱', t: 'Vamos aprendiendo',     m: 'Justo por eso existen estos juguetes: para que se entienda tocando.' }
      ].find(x => puntos >= x.min);

      $('#quizEmoji').textContent   = r.emoji;
      $('#quizTitle').textContent   = r.t;
      $('#quizMessage').textContent = `${puntos} de ${PREGUNTAS.length} correctas. ${r.m}`;
    });

    $('#quizRestart').addEventListener('click', () => {
      indice = 0; puntos = 0;
      puntosEl.textContent = '0';
      cuerpo.hidden = false;
      fin.hidden = true;
      render();
    });

    render();
  })();

  /* ---------------------------------------------------------- 10. Formularios */
  (function formularios() {
    const cotizar = $('#quoteForm');
    const pedido  = $('#orderForm');

    const valido = form => {
      if (form.checkValidity()) return true;
      form.reportValidity();
      return false;
    };

    if (cotizar) {
      cotizar.addEventListener('submit', e => {
        e.preventDefault();
        if (!valido(cotizar)) return;
        const d = new FormData(cotizar);
        const asunto = `Cotización ${d.get('kit')} — ${d.get('centro')}`;
        const cuerpo = [
          `Nombre: ${d.get('nombre')}`,
          `Centro educativo: ${d.get('centro')}`,
          `Correo: ${d.get('correo')}`,
          `Estudiantes: ${d.get('estudiantes')}`,
          `Kit de interés: ${d.get('kit')}`,
          '',
          d.get('mensaje') || ''
        ].join('\n');
        window.location.href =
          `mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        $('#quoteNote').textContent = '📨 Abrimos tu correo con todo listo. Solo dale enviar.';
      });
    }

    if (pedido) {
      pedido.addEventListener('submit', e => {
        e.preventDefault();
        if (!valido(pedido)) return;
        const d = new FormData(pedido);
        const texto = [
          `¡Hola Pura Pieza! Soy ${d.get('nombre')}.`,
          d.get('edad') ? `El güila tiene ${d.get('edad')} años.` : '',
          `Estoy en ${d.get('provincia')}.`,
          d.get('mensaje') ? `\n${d.get('mensaje')}` : ''
        ].filter(Boolean).join(' ');
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      });
    }
  })();

  /* --------------------------------------------------------------- 11. Varios */
  $('#year').textContent = new Date().getFullYear();
})();
