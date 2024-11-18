<script setup>
import { VDataTable, VBtn } from "vuetify/components";
import { useAxios } from "@vueuse/integrations/useAxios";
import axios from "axios";
import { ref } from "vue";
import { useReactiveRoute } from "./composables/ReactiveRoute";
import { setupCache } from "axios-cache-interceptor";

const baseUrl = "https://test.com";
const endpoint = new URL(`${baseUrl}/books`).toString();
const instance = setupCache(
  axios.create({
    baseUrl,
  })
);

const params = ref({
  search: "",
});

const { pushHistory, url } = useReactiveRoute(endpoint, params, {
  onStatePop: async (e) => {
    console.log("statePop: " + e.state);
    params.value = e.state;
    await execute(url.value);
  },
});

const { data, execute, isLoading } = useAxios(
  url.value,
  { method: "GET" },
  instance
);

async function search() {
  try {
    console.log(url.value);
    console.log((await execute(url.value)).response.value);
    pushHistory();
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="search">
    <input class="search__input" v-model="params.search" />
    <VBtn class="search__button" @click="() => search()">Search</VBtn>
  </div>
  <VDataTable :items="data" :loading="isLoading" />
</template>

<style lang="scss">
.search {
  display: flex;
  width: 100%;
  gap: 0.5em;

  &__input {
    margin-left: 0;
    margin-right: auto;
    border: 1px solid black;
    border-radius: 0.25rem;
    width: 100%;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
