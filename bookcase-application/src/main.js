import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VDateInput } from "vuetify/labs/VDateInput";
import { es, en } from "vuetify/locale";
import { i18n } from "./config/i18n";

import App from "./App.vue";
import router from "./router";
import piniaPersist from "pinia-plugin-persistedstate";

import "vuetify/styles";
import "flag-icons/css/flag-icons.min.css";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/base.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserCircle,
  faCamera,
  faPhone,
  faMapMarkerAlt,
  faShieldAlt,
  faClipboard,
  faBars,
  faTimes,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";

const customES = {
  ...es,
  dataIterator: {
    pageText: "{0}-{1} de {2}",
    itemsPerPageText: "Elementos por página:",
    itemsPerPageAllText: "Todos",
  },
};

const customEN = {
  ...en,
  dataIterator: {
    pageText: "{0}-{1} of {2}",
    itemsPerPageText: "Items per page:",
    itemsPerPageAllText: "All",
  },
};

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    defaultLocale: navigator.language.startsWith("es") ? "es" : "en",
    locale: "es",
    fallback: "en",
    messages: { es: customES, en: customEN },
  },
});

const pinia = createPinia();
pinia.use(piniaPersist);
library.add(
  faUser,
  faRightFromBracket,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserCircle,
  faCamera,
  faPhone,
  faMapMarkerAlt,
  faShieldAlt,
  faClipboard,
  faBars,
  faTimes,
  faEllipsisV
);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");