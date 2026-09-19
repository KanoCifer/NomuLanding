import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { readLocale } from '@/lib/locale';
import { messages } from '@/locales';
import router from '@/router';
import App from './App.vue';
import './styles/tailwind.css';
import './styles/theme.css';

const i18n = createI18n({
  legacy: false,
  locale: readLocale(),
  fallbackLocale: 'en',
  messages,
});

createApp(App).use(router).use(createHead()).use(i18n).mount('#app');
