import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from "../plugins/router"
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';

// PrimeVue imports
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_GMvRRMjlo",
      userPoolClientId: "n21mshacfik269rsduusj65ej",
      region: "us-east-2",
      loginWith: {
        email: true
      },
      userAttributes: {
        email: {
          required: true
        }
      }
    }
  }
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

Object.keys(localStorage)
  .filter(key => key.startsWith('CognitoIdentityServiceProvider.'))
  .forEach(key => localStorage.removeItem(key));

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.mount('#app')
