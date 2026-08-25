# Contexto del repositorio: PK Print News

> Estado analizado el 25 de agosto de 2026 a partir del commit `86d2c32` (`Initial commit`) y actualizado durante el saneamiento técnico posterior.

## 1. Resumen del proyecto

Este repositorio contiene **PK Print News**, un micrositio corporativo en español para PK Print. Su finalidad es:

- Presentar las áreas de servicio de PK Print.
- Publicar en el futuro artículos, guías, recursos, casos y novedades.
- Llevar tráfico a la web corporativa, WhatsApp, Instagram y correo electrónico.
- Captar preferencias de suscripción segmentadas por perfil, sector e intereses.

La implementación actual es deliberadamente sencilla: HTML, CSS y JavaScript sin framework ni proceso de compilación, más un endpoint PHP para conectar el formulario de suscripción con Mailrelay.

## 2. Estado técnico general

| Área | Estado actual |
| --- | --- |
| Frontend | HTML5, CSS y JavaScript nativos |
| Backend | Un único endpoint PHP: `subscribe.php` |
| Base de datos | No existe |
| CMS | No existe |
| Dependencias | No hay `package.json`, Composer ni librerías externas |
| Build | No hay compilación ni bundler |
| Pruebas | No hay suite de tests ni configuración de CI |
| Documentación previa | No había README ni documentación técnica |
| Git | GitHub es el origen versionado del proyecto; el despliegue desde el repositorio todavía es manual |
| Repositorio remoto | `https://github.com/jared-esparza/pkprint-news.git` |
| Hosting | IONOS con capacidad para ejecutar PHP; CI/CD pendiente de configurar |

El sitio está publicado en un hosting web de IONOS capaz de ejecutar PHP. Debe servirse mediante HTTP; abrir `index.html` directamente como `file://` no permite evaluar correctamente el `fetch` de `config.json` ni el envío al endpoint PHP. Para probar todo el flujo se necesita un servidor con PHP y la extensión cURL habilitada.

## 3. Estructura del repositorio

```text
pkprint_news/
├── index.html                  # Portada y formulario de suscripción
├── styles.css                 # Estilos exclusivos/principales de la portada
├── script.js                  # Preferencias, año y envío del formulario
├── site-config.js             # Carga común de la configuración corporativa
├── subscribe.php              # Validación y futura integración con Mailrelay
├── config.json                # Datos corporativos públicos básicos
├── section.css                # Estilos compartidos por secciones y artículos
├── section.js                 # Año dinámico del pie de página
├── img/                       # Logos e imágenes de categorías
├── textil/index.html
├── merchandising/index.html
├── imprenta/index.html
├── rotulacion/index.html
├── soluciones-online/index.html
├── recursos/index.html
├── prensa-digital/index.html
└── articulos/plantilla/index.html  # Plantilla manual para futuros artículos
```

No existe todavía la sección `casos/`; sus enlaces se han retirado temporalmente de los pies de página.

## 4. Arquitectura y navegación

### Portada

`index.html` actúa como landing principal. Incluye:

- Cabecera fija con enlace a `pkprint.es`.
- Hero de presentación de PK Print News.
- Accesos a siete secciones: Textil, Merchandising, Imprenta, Rotulación, Soluciones Online, Recursos y Prensa Digital.
- Resumen visual de cinco servicios principales.
- Bloques destacados para Recursos y Prensa Digital.
- Formulario de suscripción.
- Datos de contacto y pie de página corporativo.

### Secciones de servicio

`textil/`, `merchandising/`, `imprenta/`, `rotulacion/` y `soluciones-online/` siguen prácticamente la misma plantilla. Cada página contiene:

- Hero e imagen propios.
- Tres tarjetas de futuros contenidos.
- Una futura guía destacada.
- Ideas de aplicación y casos de uso.
- Un bloque educativo “PK Explica”.
- CTA de preferencias hacia el formulario de la portada.
- CTA comercial hacia WhatsApp.

Los artículos y guías aún no publicados muestran “Próximamente” como texto no interactivo, sin crear destinos ficticios.

### Recursos

`recursos/index.html` plantea una futura biblioteca de catálogos, plantillas de impresión y guías prácticas, organizada por utilidad y área. Sus descargas/contenidos aún no existen y los enlaces son placeholders.

### Prensa Digital

`prensa-digital/index.html` funciona más como página comercial que como categoría editorial. Explica la propuesta de convertir historias de empresa en presencia en medios, su proceso, posibles temas y reutilización de las publicaciones.

### Artículos

`articulos/plantilla/index.html` es una plantilla HTML manual con hero, metadatos, contenido, placeholders visuales, galería, CTA y barra lateral. No hay generador de contenido ni artículos reales; los seis espacios de imagen usan placeholders CSS hasta que cada artículo incorpore sus activos definitivos.

## 5. Diseño y estilos

La identidad visual usa una estética corporativa minimalista:

- Fondo gris claro y superficies blancas.
- Texto negro y azul PK Print `#00A0E3` como color de acento.
- Tipografía de sistema: Arial/Helvetica.
- Titulares grandes, tarjetas con bordes suaves y layouts basados en CSS Grid.
- Cabeceras fijas y CTAs negros o azules.
- Breakpoints principales alrededor de 980/920, 700/640 y 600 px.

La portada usa `styles.css`; todas las páginas internas y la plantilla de artículo usan `section.css`. Ambos archivos duplican parte de las reglas corporativas (especialmente marca y footer), por lo que cambios globales pueden necesitar editar los dos archivos. Los CSS muestran además una evolución incremental: hay reglas antiguas seguidas de bloques de “actualización corporativa” que las sobrescriben.

En pantallas estrechas, la navegación interna se presenta mediante un menú desplegable controlado por un botón accesible. En escritorio, los enlaces permanecen visibles en la cabecera.

## 6. JavaScript

### `script.js`

Se ejecuta al producirse `DOMContentLoaded` y realiza tres tareas:

1. Escribe el año actual en `#year`.
2. Lee uno o varios parámetros `interest` de la URL y preselecciona únicamente los intereses conocidos del formulario.
3. Intercepta el formulario `#subscription-form`, valida los campos, construye JSON y lo envía por `POST` a `subscribe.php`.

El payload del formulario tiene esta forma:

```json
{
  "name": "Nombre",
  "email": "correo@ejemplo.com",
  "clientType": "Empresa",
  "sector": "Industria",
  "interests": ["Imprenta"],
  "consent": true,
  "source": "Origen web pk print"
}
```

Las páginas de categoría pueden enlazar a URLs como `../?interest=Imprenta#suscripcion`. También se admiten varios parámetros `interest`; los valores desconocidos se ignoran.

### `site-config.js`

Resuelve `config.json` desde la URL del propio script para funcionar en portada, secciones y artículos con distinta profundidad. Actualiza los elementos marcados con `data-site-email`, `data-site-website` y `data-site-location`. Si la configuración no se puede cargar, conserva los valores escritos como fallback en el HTML.

### `section.js`

Actualiza el año del footer y controla el menú móvil de las páginas internas: apertura, cierre, Escape, selección de enlace y retorno al layout de escritorio.

## 7. Formulario e integración con Mailrelay

El formulario pide:

- Nombre y email.
- Tipo de cliente.
- Sector profesional.
- Uno o varios intereses.
- Consentimiento para recibir comunicaciones.

`subscribe.php`:

- Solo acepta `POST` con JSON.
- Valida nombre, email, tipo de cliente, sector, al menos un interés y consentimiento.
- Obtiene `MAILRELAY_API_KEY` y `MAILRELAY_BASE_URL` del entorno del servidor.
- Construye un payload con datos, consentimiento, fecha UTC e IP.
- Envía la petición con cURL a `${MAILRELAY_BASE_URL}/subscribers`.
- Convierte errores de conexión o respuestas no 2xx en respuestas JSON 502.

La integración **no está terminada**:

- El propio código indica que `/subscribers` debe sustituirse por el endpoint real.
- El esquema del payload es provisional y debe adaptarse a la API de Mailrelay utilizada.
- Todos los IDs de `$groupMap` están en `null`.
- `general_group` contiene el nombre `00-NEWS PK PRINT`, no un ID confirmado.
- Si faltan las variables de entorno, el endpoint responde 503 y ninguna suscripción se guarda.

No hay persistencia local, cola, reintentos, protección anti-spam/rate limiting ni registro de errores. El frontend envía `source`, pero PHP ignora ese valor y fija internamente el tag.

## 8. Configuración y contenido corporativo

`config.json` contiene:

```json
{
  "contactEmail": "comercial@pkprint.es",
  "corporateWebsite": "https://pkprint.es",
  "location": "Sabadell · Barcelona"
}
```

Los tres valores se consumen dinámicamente mediante `site-config.js`. Los valores siguen escritos en el HTML como fallback. El teléfono, Instagram, WhatsApp, navegación y footer permanecen repetidos en muchas páginas; al no existir plantillas ni includes, cualquier cambio corporativo global todavía requiere revisar múltiples archivos.

## 9. Contenido y activos

Los activos existentes son imágenes JPG/PNG locales para las categorías, logos y favicon. No se cargan fuentes, scripts, estilos ni imágenes desde CDNs.

Aspectos del contenido actual:

- Todo el contenido visible está en español.
- Las páginas tienen títulos y metadescripciones básicos; la plantilla de artículo no incluye metadescripción.
- No existen sitemap, robots.txt, Open Graph, datos estructurados, canonical ni analítica.
- No hay buscador, paginación, etiquetas ni sistema editorial.
- La mayoría del contenido editorial se anuncia como próximo.
- El teléfono de contacto es `633 44 24 91`, el email es `comercial@pkprint.es` y el Instagram es `@pkprint_brand`.

## 10. Estado de incidencias y deuda técnica

Resuelto durante el saneamiento técnico:

1. La portada usa la ruta correcta del favicon.
2. Se retiraron los enlaces a la sección `casos/` hasta que exista contenido real.
3. La plantilla de artículo usa placeholders CSS y ya no referencia imágenes inexistentes.
4. Los parámetros `interest` preseleccionan correctamente el formulario.
5. Los contenidos aún no publicados muestran “Próximamente” sin enlaces `href="#"`.
6. Las ocho páginas internas disponen de menú móvil accesible.
7. `contactEmail`, `corporateWebsite` y `location` se consumen desde `config.json`.
8. El hosting IONOS y el despliegue manual desde GitHub quedan documentados.

Deuda aplazada de forma explícita:

1. **Mailrelay provisional:** faltan endpoint, payload definitivo, credenciales e IDs de grupos.
2. **Contenido global duplicado:** navegación, contacto y footer siguen copiados en cada HTML.
3. **Automatización de calidad:** no hay suite permanente, linter, comprobación de enlaces ni CI/CD.
4. **Operación del formulario:** anti-abuso, observabilidad, reintentos y tratamiento de fallos se diseñarán junto con Mailrelay.
5. **SEO técnico:** sitemap, robots.txt, canonical, Open Graph y datos estructurados quedan para una ronda específica.

## 11. Convenciones útiles para cambios futuros

- Mantener rutas relativas según el nivel: portada (`img/...`), secciones (`../img/...`) y artículos (`../../img/...`).
- Los cambios visuales globales deben revisarse tanto en `styles.css` como en `section.css`.
- Una nueva sección interna debería mantener la navegación y el botón móvil comunes, marcar su enlace con `class="active"` y cargar `../section.css`, `../site-config.js` y `../section.js`.
- Un artículo nuevo debería vivir en una carpeta propia bajo `articulos/`, partiendo de `articulos/plantilla/` y sustituyendo todos los placeholders.
- No introducir secretos en HTML, JavaScript, JSON público ni Git; las credenciales de Mailrelay deben seguir en variables de entorno.
- Si aumenta el número de contenidos, convendrá decidir entre mantener HTML manual, añadir un generador estático o integrar un CMS antes de multiplicar duplicaciones.

## 12. Decisiones pendientes de confirmar

No impiden comprender el repositorio, pero serán necesarias para ciertos cambios posteriores:

- Detalles operativos de IONOS: versión de PHP, configuración del servidor, dominio final y futura automatización del despliegue.
- Versión/cuenta de Mailrelay, endpoint real, autenticación, esquema e IDs de grupos.
- Cuándo construir la futura sección `casos/` y volver a incorporarla a la navegación.
- Flujo editorial previsto: quién publica, frecuencia y si el HTML manual seguirá siendo suficiente.
- Necesidades de analítica, SEO, cookies, accesibilidad y controles anti-spam.
- Arquitectura futura para eliminar la duplicación de cabeceras, navegación y footers.

## 13. Modelo mental rápido

```text
Visitante
   ├── navega por HTML estático
   │      ├── portada
   │      ├── categorías de servicios
   │      ├── recursos
   │      └── prensa digital
   ├── contacta por enlaces externos (web, email, WhatsApp, Instagram)
   └── envía preferencias
          ↓ script.js (JSON)
      subscribe.php
          ↓ cURL + variables de entorno
      Mailrelay (integración todavía provisional)
```
