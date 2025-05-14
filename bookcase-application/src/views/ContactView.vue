<template>
  <v-container class="contact-page">
    <!-- Encabezado -->
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="contact-header">{{ $t("contacto.titulo") }}</h1>
        <p class="contact-subheader">{{ $t("contacto.descripcion") }}</p>
      </v-col>
    </v-row>

    <!-- Formulario de contacto -->
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="8">
        <v-card class="contact-card" outlined elevation="6">
          <v-card-title>
            <h2 class="text-h5 text-center mt-2 mb-2">
              {{ $t("contacto.formularioTitulo") }}
            </h2>
          </v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="handleFormSubmit"
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="formData.name"
                :label="$t('contacto.nombre')"
                :rules="[rules.required]"
                required
                class="mb-4"
              />
              <v-text-field
                v-model="formData.email"
                :label="$t('contacto.correo')"
                :rules="[rules.required]"
                type="email"
                required
                class="mb-4"
              />
              <v-text-field
                v-model="formData.subject"
                :label="$t('contacto.asunto')"
                :rules="[rules.required]"
                required
                class="mb-4"
              />
              <v-textarea
                v-model="formData.message"
                :label="$t('contacto.mensaje')"
                :rules="[rules.required]"
                required
                rows="4"
              />
              <v-btn type="submit" class="mt-4 button-enviar" block>
                {{ $t("contacto.enviar") }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" color="success" timeout="4000">
      {{ $t("contacto.mensajeEnviado") }}
    </v-snackbar>

    <!-- Información de contacto -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4 contact-card" outlined elevation="6">
          <v-card-title>
            <h2 class="text-h5 mb-2">{{ $t("contacto.otrasFormasTitulo") }}</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon class="mr-2">mdi-email</v-icon>
                <span
                  ><strong>{{ $t("contacto.correoLabel") }}:</strong>
                  Uabookcase@gmail.com</span
                >
              </v-col>

              <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon class="mr-2">mdi-phone</v-icon>
                <span
                  ><strong>{{ $t("contacto.telefonoLabel") }}:</strong> +34 600
                  400 100</span
                >
              </v-col>

              <v-col cols="12" md="4" class="d-flex align-center">
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                <span
                  ><strong>{{ $t("contacto.direccionLabel") }}:</strong>
                  Universidad de Alicante, EPS</span
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import emailjs from "emailjs-com";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const SERVICE_ID = "service_w0a84ol";
const TEMPLATE_ID_EQUIPO = "template_fbfvfc8";
const TEMPLATE_ID_USUARIO = "template_94hadc6";
const PUBLIC_KEY = "KJ5KEFiK5Ycq9NjAz";

const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const form = ref(null);
const valid = ref(false);
const snackbar = ref(false);

const rules = {
  required: (v) => !!v || t("contacto.reglaCampo"),
};

const handleFormSubmit = async () => {
  if (!valid.value) return;

  const payload = {
    ...formData.value,
    time: new Date().toLocaleString(),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_EQUIPO, payload, PUBLIC_KEY);
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_USUARIO, payload, PUBLIC_KEY);

    valid.value = false;
    snackbar.value = true;
    form.value.reset();
    form.value.resetValidation();
    formData.value = { name: "", email: "", subject: "", message: "" };
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    alert($t("contacto.alertaError"));
  }
};
</script>

<style scoped>
.contact-page {
  margin: auto;
  max-width: 1200px;
  padding: 20px;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.contact-header {
  font-size: 2.5rem;
  color: var(--color-heading);
}

.contact-subheader {
  font-size: 1.2rem;
  color: var(--color-text);
}

.contact-card {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button-enviar {
  background-color: #1867c0;
  color: white;
}

.button-enviar:hover {
  background-color: #2c3e50;
}
</style>
