<template>
  <div class="min-h-screen" id="app">
    <header class="bg-white shadow-md py-4">
      <div class="container mx-auto flex items-center justify-between px-4">
        <div class="flex items-center">
          <img
            alt="Logo"
            class="mr-2"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/vWdfdT5UeXuVSkcJPoYw8a49mbKjb9stCpNTHIvNUUrRhn3TA.jpg"
            width="40"
          />
          <span class="text-xl font-bold text-blue-600">
            HTML Accessibility Checker
          </span>
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-700 mb-4">
        Accessibility Checker
      </h1>
      <nav class="text-gray-500 mb-8">
        <a class="hover:underline" href="#">Accessibility</a> /
        <a class="hover:underline" href="#">Checker</a> /
        <span>Forms</span>
      </nav>
      <div class="flex gap-8">
        <!-- File Upload Form (Left Panel) -->
        <div
          class="bg-white p-6 rounded-md shadow-md w-[400px] flex-none h-[400px] overflow-y-auto"
        >
          <div
            v-if="errorMessage"
            class="mt-1 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative"
            role="alert"
          >
            <span class="block sm:inline">{{ errorMessage }}</span>
            <button
              type="button"
              class="absolute top-0 bottom-0 right-0 px-4 py-3"
              @click="closeError"
              aria-label="Close alert"
            >
              <svg
                class="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  d="M14.348 14.849a1 1 0 01-1.414 0L10 11.914l-2.934 2.935a1 1 0 01-1.414-1.415l2.935-2.934-2.935-2.935a1 1 0 011.415-1.414L10 8.586l2.934-2.935a1 1 0 011.414 1.415l-2.935 2.934 2.935 2.935a1 1 0 010 1.415z"
                />
              </svg>
            </button>
          </div>
          <h2 class="text-lg font-bold text-gray-700 mb-4">File Upload Form</h2>
          <form @submit.prevent="handleSubmit">
            <div
              class="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center relative h-[180px] flex items-center justify-center"
            >
              <input
                type="file"
                accept=".html"
                ref="fileInput"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="handleFileChange"
                aria-label="Upload an HTML file to check accessibility"
                title="Select an HTML file for accessibility check"
              />
              <div class="flex flex-col items-center">
                <!-- Show Cloud Icon and Text When No File Is Selected -->
                <svg
                  v-if="!selectedFile"
                  class="h-12 w-12 text-blue-500 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.42 16.58a7 7 0 00-13.42-3.42A4.992 4.992 0 003 16a5 5 0 005 5h12a5 5 0 000-10z"
                  />
                </svg>
                <p v-if="!selectedFile" class="text-gray-600 font-medium">
                  Click here to Select Your File
                </p>

                <!-- Show File Name and HTML Icon When File Is Selected -->
                <div v-if="selectedFile" class="flex items-center">
                  <svg
                    class="h-6 w-6 text-blue-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 9V5a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1h6a1 1 0 011 1z"
                    />
                  </svg>
                  <span class="text-gray-600 font-medium">{{
                    selectedFile.name
                  }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button
                class="bg-blue-600 text-white py-2 px-8 rounded-lg w-full mr-2"
                type="submit"
                :disabled="loading"
                :aria-disabled="loading"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                Upload File
              </button>
              <button
                class="bg-gray-600 text-white py-2 px-8 rounded-lg w-full ml-2"
                type="reset"
                @click="resetForm"
                :disabled="loading"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- File Accessibility Result (Right Panel) -->
        <div class="bg-white p-6 rounded-lg shadow-md flex-grow min-h-[500px]">
          <h2 class="text-lg font-bold text-gray-700 mb-4">
            File Accessibility Result
          </h2>

          <h4
            v-if="!loading && results.length"
            class="text-lg font-bold text-gray-700 mb-4"
          >
            The File Accessibility Result is {{ scores }} %
          </h4>

          <div class="relative min-h-[200px] flex items-center justify-center">
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center"
              role="status"
            >
              <!-- Loading Spinner -->
              <svg
                class="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
            <table
              v-if="!loading && results.length"
              class="w-full border-collapse"
            >
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">#</th>
                  <th class="border p-2 text-left">Type</th>
                  <th class="border p-2 text-left">Element</th>
                  <th class="border p-2 text-left">Message</th>
                  <th class="border p-2 text-left">MetaData Rule</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(issue, index) in results"
                  :key="index"
                  class="border-b"
                >
                  <td class="p-2">{{ index + 1 }}</td>
                  <td class="p-2">{{ issue.type }}</td>
                  <td class="p-2">{{ issue.element }}</td>
                  <td class="p-2">{{ issue.message }}</td>
                  <td class="p-2">{{ issue.rule_metadata }}</td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="!loading && !results.length"
              class="text-center text-gray-500"
            >
              No issues found.
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      errorMessage: null,
      selectedFile: null,
      loading: false,
      results: [],
      scores: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        this.errorMessage = "Please select a file to upload.";
        return;
      }
      if (file.type !== "text/html") {
        this.errorMessage = "Invalid file type. Please upload an HTML file.";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5 MB limit
        this.errorMessage =
          "File is too large. Please upload a file under 5MB.";
        return;
      }
      this.selectedFile = file;
    },
    resetForm() {
      this.selectedFile = null;
      this.$refs.fileInput.value = null;
      this.errorMessage = null;
      this.scores = null;
      this.results = [];
    },
    async handleSubmit() {
      if (!this.selectedFile) {
        this.errorMessage = "Please select a file to upload.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      this.results = [];

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        const apiUrl = `${process.env.VUE_APP_API_URL}/analyze`;
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.results = response.data.data.issues || [];
        this.scores = response.data.data.score || 0;
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "File upload failed.";
      } finally {
        this.loading = false; // Stop loading
      }
    },

    // resetForm() {
    //   this.formData.file = null;
    //   this.results = [];
    //   this.errorMessage = "";
    //   if (this.$refs.fileInput) {
    //     this.$refs.fileInput.value = ""; // Reset file input
    //   }
    // },
    closeError() {
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles */
</style>
