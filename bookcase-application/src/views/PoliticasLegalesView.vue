<template>
  <div class="legal-container">
    <h1 class="text-center">{{ $t("politicas.titulo") }}</h1>

    <section>
      <h2>{{ $t("politicas.secciones.introduccionTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.introduccionDescripcion") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.condicionesUsoTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.condicionesUsoDescripcion") }}
      </p>
      <p>
        {{ $t("politicas.secciones.condicionesUsoDescripcion2") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.privacidadTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.privacidadDescripcion") }}
      </p>
      <p>
        {{ $t("politicas.secciones.privacidadDescripcion2") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.cookiesTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.cookiesDescripcion") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.responsabilidadesTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.responsabilidadesDescripcion") }}
      </p>
      <p>
        {{ $t("politicas.secciones.responsabilidadesDescripcion2") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.limitacionTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.limitacionDescripcion") }}
      </p>
      <p>
        {{ $t("politicas.secciones.limitacionDescripcion2") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.propiedadTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.propiedadDescripcion") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.legislacionTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.legislacionDescripcion") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.modificacionesTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.modificacionesDescripcion") }}
      </p>
    </section>

    <section>
      <h2>{{ $t("politicas.secciones.contactoTitulo") }}</h2>
      <p>
        {{ $t("politicas.secciones.contactoDescripcion") }}
        <strong>uabookcase@gmail.com</strong>
      </p>
    </section>

    <p class="final-note">
      {{ $t("politicas.cierre") }}
    </p>
  </div>
</template>

<style scoped>
.legal-container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transition: background-color 0.3s ease, color 0.3s ease;
}

h1,
h2 {
  color: var(--color-heading);
}

section {
  margin-bottom: 25px;
}

p {
  line-height: 1.8;
  text-align: justify;
}

.final-note {
  font-weight: bold;
  text-align: justify;
  margin-top: 40px;
}
</style>
