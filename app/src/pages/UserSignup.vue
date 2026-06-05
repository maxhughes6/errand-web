<script setup lang="ts">
import { ref, watch, onMounted, Ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import Button from 'primevue/button';

import { userState, sessionState } from '../state';
import { authService } from '../services';
import { UserSignUpFormData, KrogerAuthorizationResponse } from '../models';
import { krogerStores } from '../constants';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const dietaryOptions = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Dairy-Free', value: 'dairy-free' },
  { label: 'Nut-Free', value: 'nut-free' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Halal', value: 'halal' },
  { label: 'Kosher', value: 'kosher' },
];

const storeOptions = Object.values(krogerStores);

const formData: Ref<UserSignUpFormData> = ref({
  dietaryPreferences: [],
});

const selectedStore = ref<{ label: string; value: string } | undefined>(undefined);
const hasAuthorized = ref(false);
const isSubmitting = ref(false);

const showAuthorizeButton = computed(() => !hasAuthorized.value);

async function onSubmit() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const user = userState.getUser();
  if (!user) {
    isSubmitting.value = false;
    return;
  }

  // Kroger auth is optional — use it only if present
  const storedAuthResponse = sessionStorage.getItem('krogerAuthResponse');
  const authResponse: KrogerAuthorizationResponse | null = storedAuthResponse
    ? JSON.parse(storedAuthResponse)
    : null;

  try {
    const userSignedIn = await authService.createUserAndSignIn(formData.value, authResponse);

    if (storedAuthResponse) {
      sessionStorage.removeItem('krogerAuthResponse');
    }

    userState.setErrandUserData(userSignedIn.user);

    sessionState.setSessionId(userSignedIn.sessionId);
    sessionState.setMustReauthorize(userSignedIn.mustReauthorize);
    sessionState.setIsKrogerAccountConnected(userSignedIn.isKrogerAccountConnected);
    

    router.push('/home');
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Setup Error', detail: 'Something went wrong setting up your profile. Please try again.', life: 4000 });
    isSubmitting.value = false;
  }
}

function handleAuthorizeGrocererClick() {
  sessionStorage.setItem('formData', JSON.stringify(formData.value));
  sessionStorage.setItem('selectedStore', JSON.stringify(selectedStore.value));
  authService.redirectToGrocererAuthorization(selectedStore.value!.value);
}

onMounted(() => {
  const storedFormData = sessionStorage.getItem('formData');
  if (storedFormData) {
    formData.value = JSON.parse(storedFormData);
    sessionStorage.removeItem('formData');
  }

  const storedStore = sessionStorage.getItem('selectedStore');
  if (storedStore) {
    selectedStore.value = JSON.parse(storedStore);
    sessionStorage.removeItem('selectedStore');
  }

  hasAuthorized.value = route.query.auth === 'success';
});
</script>

<template>
  <div class="page-container">
    <div class="page-content">
      <h1>Complete Your Profile</h1>
      <p class="page-description">Welcome! A couple of quick questions before you start.</p>

      <form class="signup-form" @submit.prevent="onSubmit">

        <!-- Dietary preferences -->
        <div class="form-group">
          <label for="dietaryPreferences">Dietary Preferences <span class="optional-badge">optional</span></label>
          <MultiSelect
            id="dietaryPreferences"
            v-model="formData.dietaryPreferences"
            :options="dietaryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select dietary preferences"
            :maxSelectedLabels="3"
            class="form-multiselect"
          />
        </div>

        <!-- Kroger connection (optional) -->
        <div class="kroger-section">
          <div class="kroger-section-header">
            <div class="kroger-section-title">
              <i class="pi pi-shopping-cart"></i>
              <span>Connect Kroger <span class="optional-badge">optional</span></span>
            </div>
            <p class="kroger-section-description">
              Connecting a Kroger account lets you search grocery products and add recipe ingredients directly to your cart. You can skip this now and connect later.
            </p>
          </div>

          <div class="form-group">
            <label for="preferredStore">Preferred Store</label>
            <Select
              id="preferredStore"
              v-model="selectedStore"
              :options="storeOptions"
              optionLabel="label"
              placeholder="Select or search for a store"
              class="form-select"
              checkmark
              :highlightOnSelect="false"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="store-option">
                  <img :src="slotProps.value.imageUrl" height="30px" width="50px" />
                  <span>{{ slotProps.value.label }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div class="store-option">
                  <img :src="slotProps.option.imageUrl" height="30px" width="50px" />
                  <span>{{ slotProps.option.label }}</span>
                </div>
              </template>
            </Select>
          </div>

          <!-- Authorize button — visible once store selected, before auth -->
          <Button
            v-if="showAuthorizeButton && selectedStore"
            class="submit-btn authorize-btn"
            icon="pi pi-external-link"
            iconPos="right"
            :label="'Connect ' + selectedStore.label + ' account'"
            @click="handleAuthorizeGrocererClick"
          />

          <!-- Authorized confirmation -->
          <div v-else-if="hasAuthorized" class="authorized-confirmation">
            <i class="pi pi-check-circle"></i>
            <span>Account authorized! Thank you for connecting your Kroger account.</span>
          </div>
        </div>

        <!-- Skip note -->
        <p v-if="!selectedStore" class="skip-note">
          <i class="pi pi-info-circle"></i>
          No Kroger account? No problem — you can generate recipes right away. Connect Kroger later to search products and add ingredients to your cart.
        </p>

        <button type="submit" class="submit-btn" :disabled="isSubmitting || (!!selectedStore && !hasAuthorized)">
          <span v-if="isSubmitting">Setting up your account…</span>
          <span v-else>Continue</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem;
  font-family: "Montserrat", sans-serif;
}

.page-content {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  padding: 2.5rem;

  h1 {
    color: #4713a3;
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    font-family: "Montserrat", sans-serif;
  }

  .page-description {
    color: #5d4a7a;
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;

  label {
    color: #5d4a7a;
    font-weight: 500;
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.optional-badge {
  display: inline-block;
  background: #f0ebff;
  color: #6e3ff3;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  vertical-align: middle;
}

/* Kroger section */
.kroger-section {
  border: 1px solid #e0d4f7;
  border-radius: 14px;
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #faf7ff;
}

.kroger-section-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.kroger-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4713a3;
  font-weight: 600;
  font-size: 1rem;

  i {
    font-size: 1.1rem;
  }
}

.kroger-section-description {
  margin: 0;
  color: #6d5e8c;
  font-size: 0.9rem;
  line-height: 1.55;
}

.store-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.authorized-confirmation {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #217a3c;
  font-size: 0.92rem;
  font-weight: 500;
  background: #edfaf2;
  border: 1px solid #a8e6bc;
  border-radius: 8px;
  padding: 0.7rem 1rem;

  i {
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  a {
    color: #4713a3;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

.skip-note {
  margin: 0;
  background: #f3edff;
  border: 1px solid #d9c9f8;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  color: #5d4a7a;
  font-size: 0.88rem;
  line-height: 1.55;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  i {
    flex-shrink: 0;
    margin-top: 0.05rem;
    color: #6e3ff3;
  }
}

.authorize-btn {
  margin-top: 0.25rem;
}

:deep(.form-multiselect),
:deep(.form-select) {
  width: 100%;
  font-family: "Montserrat", sans-serif;

  .p-multiselect-label,
  .p-select-label {
    padding: 0.75rem 1rem;
    font-family: "Montserrat", sans-serif;
    font-size: 1rem;
    color: #333;
  }

  .p-multiselect-dropdown,
  .p-select-dropdown {
    padding-right: 8px;
  }

  .p-multiselect-label.p-placeholder,
  .p-select-label.p-placeholder {
    color: #9b8bb5;
  }

  &.p-multiselect,
  &.p-select {
    border: 2px solid #e0d4f7;
    border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover {
      border-color: #c9b8e8;
    }

    &.p-focus {
      border-color: #4713a3;
      box-shadow: 0 0 0 3px rgba(71, 19, 163, 0.1);
    }
  }
}

.submit-btn {
  margin-top: 0.25rem;
  background: linear-gradient(90deg, #4713a3 60%, #6e3ff3 100%);
  color: white;
  border: none;
  gap: 8px;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.1s, background 0.2s;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #4713a3 60%, #6e3ff3 100%);
    color: white;
    box-shadow: 0 0 18px 2px rgba(110, 63, 243, 0.55), 0 4px 18px 0 rgba(71, 19, 163, 0.25);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>

<style lang="scss">
.p-select-overlay,
.p-multiselect-overlay {
  background: #fff;
  z-index: 9999 !important;
  border-radius: 8px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.12), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  border: 1px solid #e0d4f7;

  .p-select-list,
  .p-multiselect-list {
    background: #fff;
  }

  .p-select-option,
  .p-multiselect-option {
    font-family: "Montserrat", sans-serif;
    gap: 5px;
    padding: 0.6rem 1rem;
    transition: background 0.15s ease;

    &:hover,
    &.p-focus,
    &[data-p-focused="true"] {
      background: #f3edff !important;
      color: #4713a3;
    }

    &.p-selected,
    &[data-p-highlight="true"] {
      background: #e8ddf8 !important;
      color: #4713a3;
    }

    &.p-selected:hover,
    &[data-p-highlight="true"]:hover {
      background: #ddd0f3 !important;
      color: #4713a3;
    }
  }
}
</style>
