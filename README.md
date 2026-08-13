# Pura Pieza 🇨🇷

Landing page para una tienda costarricense de **juguetes, fidgets y rompecabezas
impresos en 3D** con enfoque educativo. Todo en español (voz tica), sin
frameworks, sin build step, sin dependencias.

> ⚠️ Sitio de demostración: los precios, testimonios y datos de contacto son de
> ejemplo. Ver [Qué cambiar antes de publicar](#qué-cambiar-antes-de-publicar).

## Cómo verlo

Abrí `index.html` en el navegador. Nada más. Si preferís servirlo:

```bash
python3 -m http.server 8000   # luego entrá a http://localhost:8000
```

## Archivos

| Archivo       | Qué hay adentro |
|---------------|-----------------|
| `index.html`  | Todo el contenido y la estructura |
| `styles.css`  | Estilos, tokens de color y modo oscuro |
| `script.js`   | Catálogo, filtros y los tres juegos del laboratorio |
| `favicon.svg` | Ícono de la marca |

## Secciones

1. **Hero** — impresora 3D animada en CSS y contadores.
2. **Beneficios** — las cuatro habilidades que trabajan los chunches.
3. **Catálogo** — 8 productos filtrables por edad y por habilidad.
4. **Laboratorio de Chunches** — la parte interactiva:
   - *Girá el fidget*: spinner con física real (momento angular, fricción de
     rodamiento y fricción del aire). Se arrastra con el mouse o el dedo, o se
     empuja con la barra espaciadora. Muestra RPM, vueltas y datos que se
     desbloquean según la velocidad.
   - *Armá tu chunche*: personalizador de forma, color y textura con vista
     previa en SVG en vivo, más precio y tiempo de impresión estimados.
   - *Reto rápido*: quiz de 5 preguntas sobre impresión 3D, geometría y
     engranajes, con explicación después de cada respuesta.
5. **Cómo funciona** — los cuatro pasos del pedido.
6. **Escuelas y docentes** — tres kits de aula + formulario de cotización.
7. **Envíos y pagos** — GAM, Correos de Costa Rica, retiro en persona, SINPE
   Móvil, transferencia y factura electrónica.
8. **Testimonios**, **preguntas frecuentes** y **contacto**.

## Qué cambiar antes de publicar

Todo lo editable de contacto está arriba de `script.js`:

```js
const WHATSAPP = '50600000000';   // número real, formato internacional sin +
const CORREO   = 'hola@purapieza.cr';
```

Además:

- **Catálogo**: el arreglo `CHUNCHES` en `script.js` (nombre, precio, emoji,
  edad, habilidades). Cambiar los emojis por fotos reales es el mayor salto de
  calidad que le podés dar al sitio.
- **Precios de kits y envíos**: están en `index.html`, en las secciones
  `#escuelas` y `#envios`.
- **Redes sociales**: los enlaces del footer están en `#`.
- **Testimonios**: son inventados. Reemplazalos por reseñas reales antes de
  publicar.

Los dos formularios no tienen backend: el de escuelas abre el cliente de correo
con la proforma prellenada y el de contacto abre WhatsApp con el mensaje ya
escrito. Nada se guarda ni se envía desde el sitio.

## Detalles técnicos

- **Modo claro y oscuro**: se respeta la preferencia del sistema y hay un botón
  en el nav que la sobreescribe (se guarda en `localStorage`).
- **Accesibilidad**: enlace de salto al contenido, pestañas con navegación por
  flechas del teclado, `aria-pressed` en los filtros, estados de foco visibles,
  el spinner se puede accionar con el teclado y todo el sitio respeta
  `prefers-reduced-motion`.
- **Responsive**: una sola columna bajo 980 px, menú hamburguesa bajo 820 px.
- **Sin recursos externos**: no hay fuentes, CDN ni imágenes remotas. Funciona
  offline y se puede subir tal cual a GitHub Pages, Netlify o Vercel.

## Publicar en GitHub Pages

Settings → Pages → Source: `Deploy from a branch` → rama de este trabajo,
carpeta `/ (root)`.
