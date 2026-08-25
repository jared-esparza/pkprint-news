# Contexto del repositorio: PK Print News

> Estado actualizado el 25 de agosto de 2026 tras integrar el formulario nativo de Mailrelay y automatizar el despliegue.

## 1. Resumen

PK Print News es un micrositio corporativo en español para presentar las áreas de servicio de PK Print, publicar contenido editorial en el futuro y captar suscriptores segmentados por perfil, sector e intereses.

La web usa HTML, CSS y JavaScript nativos, sin framework, CMS, base de datos ni proceso de compilación. El formulario se sirve temporalmente como un iframe nativo de Mailrelay; la web no maneja claves de API ni datos de suscripción mediante un backend propio.

## 2. Entorno y publicación

| Área | Estado actual |
| --- | --- |
| Frontend | HTML5, CSS y JavaScript nativos |
| Backend propio | Ninguno |
| Formulario | Iframe nativo de Mailrelay |
| Dependencias locales | Sin npm ni Composer |
| Pruebas | Prueba Node focalizada para el estado de confirmación |
| Repositorio | `https://github.com/jared-esparza/pkprint-news.git` |
| Rama publicada | `main` |
| Hosting | IONOS, con soporte PHP disponible pero no utilizado por el formulario actual |
| Dominio | `https://news.pkprint.es` |
| Despliegue | GitHub Actions por SFTP, incremental, al hacer push a `main` o mediante ejecución manual |

El workflow está en `.github/workflows/deploy-ionos.yml` y utiliza los secretos `IONOS_USER`, `IONOS_HOST` e `IONOS_PASSWORD`. Excluye Git, GitHub Actions, Markdown, pruebas y resultados de pruebas. Al ser incremental, un archivo eliminado del repositorio puede requerir borrado manual en IONOS.

## 3. Estructura relevante

```text
pkprint_news/
├── .github/workflows/deploy-ionos.yml
├── index.html
├── styles.css
├── script.js
├── site-config.js
├── config.json
├── section.css
├── section.js
├── legacy-subscription-form.md
├── tests/subscription-status.test.js
├── img/
├── textil/index.html
├── merchandising/index.html
├── imprenta/index.html
├── rotulacion/index.html
├── soluciones-online/index.html
├── recursos/index.html
├── prensa-digital/index.html
└── articulos/plantilla/index.html
```

No existe la sección `casos/`; sus enlaces se retiraron hasta que haya contenido real. Los artículos, guías y descargas aún no publicados se muestran como elementos no interactivos con el texto “Próximamente”.

## 4. Arquitectura y navegación

`index.html` es la portada y contiene el hero, accesos a las siete áreas, destacados, suscripción, contacto y footer. Las cinco páginas de servicios comparten una estructura editorial. Recursos plantea una futura biblioteca; Prensa Digital funciona como página comercial; `articulos/plantilla/` es una base manual con placeholders CSS.

Las ocho páginas internas tienen un menú móvil accesible por debajo de 980 px. `section.js` gestiona apertura, cierre, Escape, selección de enlace, `aria-expanded` y vuelta al modo escritorio.

La portada usa `styles.css`; las páginas internas usan `section.css`. Ambos duplican parte de la identidad visual y del footer, por lo que un cambio global puede exigir editar los dos.

## 5. JavaScript y configuración

### `script.js`

- Actualiza el año del footer.
- Si la URL contiene `?subscription=confirmed`, muestra una confirmación accesible en `#form-status`.
- Ignora cualquier otro valor de `subscription`.
- No inspecciona ni intercepta el formulario de Mailrelay.

Los enlaces de categoría conservan URLs como `../?interest=Imprenta#suscripcion`, pero la preselección está temporalmente inactiva. El iframe pertenece a `news19.ipzmarketing.com` y la política de mismo origen impide que el JavaScript de PK Print modifique sus campos.

### `site-config.js`

Resuelve `config.json` desde la URL del propio script y actualiza los elementos con `data-site-email`, `data-site-website` y `data-site-location`. Si falla la carga, mantiene los valores HTML como fallback.

### `section.js`

Actualiza el año y controla la navegación móvil de las páginas internas.

## 6. Integración de Mailrelay

La portada incrusta el formulario publicado en:

```text
https://news19.ipzmarketing.com/f/oh8TmNfA0Ok
```

El script de ajuste de altura procede de `assets.ipzmarketing.com`. El formulario y reCAPTCHA son dependencias externas en tiempo de ejecución.

Configuración acordada en Mailrelay:

- Un único grupo general: `00-NEWS PK PRINT`.
- Tres campos personalizados: `Sector`, `Tipo de cliente` e `Intereses`.
- Los sectores se gestionan como segmentos dinámicos basados en el campo `Sector`, no como grupos separados.
- Consentimiento con enlace a la política de privacidad.
- Doble opt-in, CAPTCHA y honeypot activos.
- Contenido personalizado después de enviar el formulario.

El envío y sus estados inmediatos se gestionan dentro del iframe. La página principal solo interpreta el retorno final `?subscription=confirmed#suscripcion` si Mailrelay lo utiliza como URL tras la confirmación.

No se usa `POST /send_emails`, SMTP+API, una API key ni un endpoint PHP propio. Los identificadores y URLs del iframe son públicos por naturaleza; nunca deben confundirse con credenciales.

## 7. Formulario propio archivado

`legacy-subscription-form.md` conserva el HTML del formulario anterior y referencias para recuperarlo en el futuro. El workflow excluye Markdown, así que no se publica. Los estilos del formulario propio permanecen en `styles.css` para facilitar esa futura migración.

El endpoint PHP provisional se retiró del repositorio. Su versión histórica y el JavaScript anterior están disponibles en Git. Debido al despliegue incremental, su copia debe borrarse manualmente de IONOS después de publicar estos cambios.

Si se recupera el formulario propio, deberá conectarse a Mailrelay a través de un backend seguro. Ninguna API key puede exponerse en HTML, JavaScript, `config.json`, el repositorio o la respuesta del servidor.

## 8. Configuración corporativa pública

`config.json` contiene:

```json
{
  "contactEmail": "comercial@pkprint.es",
  "corporateWebsite": "https://pkprint.es",
  "location": "Sabadell · Barcelona"
}
```

Estos datos son públicos. Teléfono, Instagram, WhatsApp, navegación y footer siguen repetidos en múltiples HTML.

## 9. Estado de incidencias

Resuelto:

1. Ruta del favicon de portada.
2. Retirada de enlaces a `casos/` y destinos `href="#"`.
3. Placeholders CSS en la plantilla de artículo.
4. Menú móvil accesible en páginas internas.
5. Consumo común de `config.json`.
6. Despliegue automático incremental de GitHub a IONOS.
7. Sustitución del backend provisional por el formulario nativo seguro de Mailrelay.
8. Consentimiento, doble opt-in, CAPTCHA y honeypot configurados en Mailrelay.

Aplazado:

1. Recuperar el formulario propio y la preselección mediante `?interest=...`.
2. Refactorizar cabeceras, navegación, contacto y footers duplicados.
3. Ampliar las pruebas, validadores y comprobaciones automáticas de calidad.
4. Añadir observabilidad propia si en el futuro existe un backend.
5. SEO técnico: sitemap, robots, canonical, Open Graph y datos estructurados.
6. Crear contenidos, descargas y la sección de casos.

## 10. Convenciones para cambios futuros

- Mantener rutas relativas según la profundidad de cada página.
- Revisar `styles.css` y `section.css` ante cambios visuales globales.
- No modificar la URL, atributos o script del iframe sin regenerar o verificar el código en Mailrelay.
- Configurar grupos, campos, segmentos, doble opt-in y textos desde el panel de Mailrelay.
- No guardar secretos en archivos públicos o versionados.
- No asumir que eliminar un archivo del repositorio lo elimina de IONOS: el despliegue es incremental.
- Si crece el contenido, decidir entre HTML manual, un generador estático o un CMS antes de multiplicar duplicaciones.

## 11. Modelo mental rápido

```text
Visitante
   ├── navega por el sitio estático de PK Print News
   ├── contacta mediante enlaces externos
   └── completa el iframe de Mailrelay
          ↓ CAPTCHA + honeypot + consentimiento
      contacto inactivo en 00-NEWS PK PRINT
          ↓ correo de doble opt-in
      contacto confirmado y segmentado por campos personalizados
```
