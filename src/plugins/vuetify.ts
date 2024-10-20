/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#5D8136',
          'primary-lighten-1': '#86B752',
          secondary: '#9cd7f0',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#f5f5f5',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#537330',
          'primary-lighten-1': '#537330',
          secondary: '#1877A0',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#121212',
        },
      },
    },
    defaultTheme: 'light',
  },
})
