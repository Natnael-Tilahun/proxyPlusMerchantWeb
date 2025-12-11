// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    // preset: "vercel",
    routeRules: {
      "/**": {
        headers: {
          "x-powered-by": "",
          server: "",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      },
    },
  },
  ssr: false,

  runtimeConfig: {
    public: {
      // Only expose non-sensitive configuration to client
      HOME_URL:
        process.env.HOME_URL || "https://mbmerchantuat.cbe.com.et",
      persistedState: {
        storage: "cookies",
        debug: false,
        cookieOptions: {},
      },
    },
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

    // Build-time environment replacement
    vite: {
      define: {
        // Replace sensitive URLs at build time
        __API_BASE_URL__: JSON.stringify(process.env.API_BASE_URL),
        __X_APP_ID__: JSON.stringify(process.env.X_APP_ID),
        __X_APP_VERSION__: JSON.stringify(process.env.X_APP_VERSION),
        __STOMP_URL__: JSON.stringify(process.env.STOMP_URL),
        __HOME_URL__:JSON.stringify(process.env.HOME_URL)
      },
    },

  app: {
    head: {
      title: "CBE Merchant Site",
      link: [],
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    // "@nuxtjs/color-mode",
    "@davestewart/nuxt-scrollbar",
    "nuxt-icon",
    "@pinia/nuxt",
    // "@nuxt/image",
    "@pinia-plugin-persistedstate/nuxt"
  ],

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  // colorMode: {
  //   classSuffix: "",
  // },
  hooks: {
    "components:dirs": (dirs) => {
      dirs.unshift({
        path: "~/components/ui",
        // this is required else Nuxt will autoImport `.ts` file
        extensions: [".vue"],
        // prefix for your components, eg: UiButton
        prefix: "Ui",
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      });
    },
  },

  plugins: ["~/plugins/session-sync.client.ts"],

  imports: {
    dirs: [
      // Scan top-level modules
      "composables",
      // ... or scan modules nested one level deep with a specific name and file extension
      "composables/*/index.{ts,js,mjs,mts}",
      // ... or scan all modules within given directory
      "composables/**",
    ],
  },

  compatibilityDate: "2024-07-09",
});