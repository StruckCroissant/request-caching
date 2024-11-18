import { createApp } from "vue";
import App from "./App.vue";
import "vuetify/styles";
import { worker } from "../mocks/browser";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

worker.start();

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).mount("#app");
