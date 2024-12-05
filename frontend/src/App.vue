<template>
  <div id="app">
    <FileUploadComponent />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import FileUploadComponent from "@/components/FileUploadComponent.vue";

@Options({
  components: {
    FileUploadComponent,
  },
})
export default class App extends Vue {}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
</style>
