import { toValue, toRaw, onMounted, onUnmounted, computed } from "vue";

/**
 *
 * @param {import('vue').MaybeRefOrGetter} initialUrl
 * @param {import('vue').MaybeRefOrGetter} params
 * @param {{onStatePop: () => void}} options
 */
export function useReactiveRoute(initialUrl, params = {}, options = {}) {
  if (options?.onStatePop) {
    const listener = (e) => options.onStatePop(e);
    onMounted(() => addEventListener("popstate", listener));
    onUnmounted(() => removeEventListener("popstate", listener));
  }

  function getParams() {
    const unproxiedParams = toRaw(toValue(params));
    return Object.fromEntries(
      Object.entries(unproxiedParams).filter(([, v]) => v !== "")
    );
  }

  function pushHistory() {
    const urlObj = new URL(url.value);
    const pathAndParams = `${
      urlObj.pathname
    }?${urlObj.searchParams.toString()}`;
    window.history.pushState(getParams(), "", pathAndParams);
  }

  const url = computed(() => {
    const paramObj = new URLSearchParams(toValue(params));
    const paramStr = paramObj.toString();
    const unrefedUrl = toValue(initialUrl);

    return `${unrefedUrl}?${paramStr}`;
  });

  return {
    pushHistory,
    url,
  };
}
