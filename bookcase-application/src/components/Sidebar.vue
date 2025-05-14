<template>
  <component
    :is="isMobile ? 'SidebarMobile' : 'SidebarDesktop'"
    :drawer="drawer"
    @update:drawer="$emit('update:drawer', $event)"
  />
</template>

<script>
import SidebarDesktop from "./SidebarDesktop.vue";
import SidebarMobile from "./SidebarMobile.vue";

export default {
  props: {
    drawer: Boolean,
  },
  emits: ["update:drawer"],
  components: {
    SidebarDesktop,
    SidebarMobile,
  },
  data() {
    return {
      isMobile: false,
    };
  },
  mounted() {
    this.checkViewport();
    window.addEventListener("resize", this.checkViewport);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkViewport);
  },
  methods: {
    checkViewport() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>
