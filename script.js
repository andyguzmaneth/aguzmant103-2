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

  /* --------------------------------------------------- 5. Catálogo y filtros */
  const CHUNCHES = [
    {
      nombre: 'Cubo Infinito Tico',
      desc: 'Ocho piezas que giran sin fin. Imposible soltarlo en una reunión.',
      precio: 8500, emoji: '🧊', edad: 6, edadTxt: '6+',
      habilidades: ['motricidad', 'calma'], color: '#12b0c9',
      etiquetas: ['Motricidad fina', 'Concentración']
    },
    {
      nombre: 'Engranajes Locos',
      desc: 'Set planetario que se arma solo con las manos. Causa y efecto en vivo.',
      precio: 12900, emoji: '⚙️', edad: 6, edadTxt: '7+',
      habilidades: ['ciencia', 'motricidad'], color: '#ffb703',
      etiquetas: ['Física', 'Mecánica']
    },
    {
      nombre: 'Rana Saltarina Articulada',
      desc: 'Imprime en una sola pieza y salta de verdad. Anatomía en la mano.',
      precio: 6500, emoji: '🐸', edad: 3, edadTxt: '4+',
      habilidades: ['ciencia', 'motricidad'], color: '#12b06a',
      etiquetas: ['Biología', 'Juego libre']
    },
    {
      nombre: 'Torre de Fracciones',
      desc: 'Medios, tercios y quintos que encajan. Se entienden porque se tocan.',
      precio: 14500, emoji: '➗', edad: 8, edadTxt: '8+',
      habilidades: ['mate'], color: '#7c5cff',
      etiquetas: ['Fracciones', 'MEP 4.º–6.º']
    },
    {
      nombre: 'Dragón Flexi de Bolsillo',
      desc: '32 vértebras articuladas. Cabe en el bolsillo y aguanta la ansiedad.',
      precio: 9900, emoji: '🐉', edad: 6, edadTxt: '5+',
      habilidades: ['calma', 'motricidad'], color: '#ff6b4a',
      etiquetas: ['Fidget', 'Narrativa']
    },
    {
      nombre: 'Rompecabezas Volcán Arenal',
      desc: 'Doce capas geológicas que se apilan. Geografía tica en 3D.',
      precio: 11500, emoji: '🌋', edad: 8, edadTxt: '8+',
      habilidades: ['ciencia', 'mate'], color: '#ff5da8',
      etiquetas: ['Geografía CR', 'Geometría']
    },
    {
      nombre: 'Perezoso Fidget',
      desc: 'Se cuelga del bolso y gira despacito. Nuestro superventas sensorial.',
      precio: 5500, emoji: '🦥', edad: 3, edadTxt: '3+',
      habilidades: ['calma'], color: '#12b0c9',
      etiquetas: ['Sensorial', 'Autorregulación']
    },
    {
      nombre: 'Laberinto de Canicas Modular',
      desc: 'Doce módulos que se reconfiguran. Ingeniería a punta de ensayo y error.',
      precio: 18900, emoji: '🌀', edad: 6, edadTxt: '6+',
      habilidades: ['ciencia', 'mate', 'motricidad'], color: '#ffb703',
      etiquetas: ['Ingeniería', 'Gravedad']
    }
  ];

  (function catalogo() {
    const grid   = $('#productGrid');
    const vacio  = $('#productEmpty');
    const conteo = $('#filterCount');
    if (!grid) return;

    grid.innerHTML = CHUNCHES.map(c => `
      <article class="product" data-edad="${c.edad}" data-habilidades="${c.habilidades.join(' ')}">
        <div class="product__art" style="--art:${c.color}">
          <span class="product__emoji" aria-hidden="true">${c.emoji}</span>
          <span class="product__age">${c.edadTxt}</span>
        </div>
        <div class="product__body">
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

    const estado = { edad: 'todas', habilidad: 'todas' };

    const aplicar = () => {
      let visibles = 0;
      $$('.product', grid).forEach(card => {
        const edadOk = estado.edad === 'todas' || Number(card.dataset.edad) <= Number(estado.edad);
        const habOk  = estado.habilidad === 'todas' ||
                       card.dataset.habilidades.split(' ').includes(estado.habilidad);
        const mostrar = edadOk && habOk;
        card.hidden = !mostrar;
        if (mostrar) visibles++;
      });
      vacio.hidden = visibles > 0;
      conteo.textContent = visibles === 1
        ? '1 chunche encontrado'
        : `${visibles} chunches encontrados`;
    };

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
