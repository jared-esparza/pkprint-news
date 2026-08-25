# Formulario propio archivado

Este archivo conserva la estructura visual del formulario propio anterior a la integración temporal mediante iframe de Mailrelay.

- No se publica en IONOS: el workflow excluye los archivos `*.md`.
- El JavaScript de preselección y envío, junto con el endpoint PHP provisional, puede consultarse en el commit `8993950`.
- La interfaz admitía `?interest=<valor>#suscripcion`; no puede aplicarse al iframe actual porque su contenido pertenece a otro dominio.
- Si se recupera este formulario, la recepción deberá implementarse de nuevo con un backend seguro. No debe conectarse directamente a Mailrelay desde JavaScript ni almacenar claves en el repositorio.

```html
<form id="subscription-form" novalidate>
  <div class="form-grid">
    <div class="field">
      <label for="name">Nombre</label>
      <input id="name" name="name" type="text" autocomplete="name" required />
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" autocomplete="email" required />
    </div>
  </div>

  <div class="form-grid">
    <div class="field">
      <label for="clientType">Tipo de cliente</label>
      <select id="clientType" name="clientType" required>
        <option value="">Selecciona una opción</option>
        <option>Empresa</option>
        <option>Autónomo</option>
        <option>Asociación / colectivo</option>
        <option>Particular</option>
        <option>Otro</option>
      </select>
    </div>

    <div class="field">
      <label for="sector">Sector profesional</label>
      <select id="sector" name="sector" required>
        <option value="">Selecciona una opción</option>
        <option>Construcción y reformas</option>
        <option>Instaladores y mantenimiento</option>
        <option>Hostelería</option>
        <option>Industria</option>
        <option>Automoción</option>
        <option>Logística y transporte</option>
        <option>Comercios</option>
        <option>Sanidad / Estética</option>
        <option>Asociaciones / Colectivos</option>
        <option>Otros profesionales</option>
      </select>
    </div>
  </div>

  <fieldset class="field interests">
    <legend>¿Qué información te interesa?</legend>
    <label><input type="checkbox" name="interests" value="Textil personalizado / Ropa laboral" /> <span>Textil personalizado / Ropa laboral</span></label>
    <label><input type="checkbox" name="interests" value="Merchandising" /> <span>Merchandising</span></label>
    <label><input type="checkbox" name="interests" value="Imprenta" /> <span>Imprenta</span></label>
    <label><input type="checkbox" name="interests" value="Rotulación / Soportes publicitarios" /> <span>Rotulación / Soportes publicitarios</span></label>
    <label><input type="checkbox" name="interests" value="Soluciones Online" /> <span>Soluciones Online</span></label>
  </fieldset>

  <label class="consent">
    <input type="checkbox" id="consent" name="consent" required />
    <span>Acepto recibir comunicaciones de PK Print y he leído la <a href="https://pkprint.es/privacy-cookie-policy/" target="_blank" rel="noopener">política de privacidad</a>.</span>
  </label>

  <button class="btn btn-primary submit-btn" type="submit">Quiero recibir novedades</button>
  <p class="form-note">Puedes darte de baja en cualquier momento.</p>
  <div id="form-status" class="form-status" role="status" aria-live="polite"></div>
</form>
```
