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
  padding: var(--space-lg);
  font-family: var(--font-body);
}

.page-content {
  width: 100%;
  max-width: 600px;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  box-shadow: 0 4px 24px oklch(20% 0.012 50 / 0.08);
  padding: var(--space-xl);

  h1 {
    font-family: var(--font-display);
    color: var(--color-ink);
    font-size: var(--text-xl);
    font-weight: 700;
    margin: 0 0 var(--space-2xs) 0;
  }

  .page-description {
    color: var(--color-ink-2);
    font-size: var(--text-md);
    margin: 0 0 var(--space-lg) 0;
  }
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;

  label {
    color: var(--color-ink-2);
    font-weight: 500;
    font-size: var(--text-sm);
    margin-bottom: var(--space-3xs);
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
  }
}

.optional-badge {
  display: inline-block;
  background: var(--color-accent-2-bg);
  color: var(--color-accent-2);
  border: 1px solid var(--color-accent-2-border);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  vertical-align: middle;
}

.kroger-section {
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background: var(--color-paper-2);
}

.kroger-section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.kroger-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-ink);
  font-weight: 600;
  font-size: var(--text-base);

  i {
    font-size: var(--text-md);
  }
}

.kroger-section-description {
  margin: 0;
  color: var(--color-ink-2);
  font-size: var(--text-sm);
  line-height: 1.55;
}

.store-option {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.authorized-confirmation {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-accent-2);
  font-size: var(--text-sm);
  font-weight: 500;
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  border-radius: var(--radius-input);
  padding: var(--space-2xs) var(--space-sm);

  i {
    font-size: var(--text-base);
    flex-shrink: 0;
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

.skip-note {
  margin: 0;
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-input);
  padding: var(--space-2xs) var(--space-sm);
  color: var(--color-ink-2);
  font-size: var(--text-sm);
  //line-height: 1.55;
  display: flex;
  align-items: flex-start;
  gap: var(--space-2xs);

  i {
    flex-shrink: 0;
    color: var(--color-accent);
    margin-top: 3px;
  }
}

.authorize-btn {
  margin-top: var(--space-3xs);
}

:deep(.form-multiselect),
:deep(.form-select) {
  width: 100%;
  font-family: var(--font-body);

  .p-multiselect-label,
  .p-select-label {
    padding: 0.75rem 1rem;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-ink);
  }

  .p-multiselect-dropdown,
  .p-select-dropdown {
    padding-right: 8px;
  }

  .p-multiselect-label.p-placeholder,
  .p-select-label.p-placeholder {
    color: var(--color-ink-2);
  }

  &.p-multiselect,
  &.p-select {
    border: 2px solid var(--color-rule);
    border-radius: var(--radius-input);
    transition: border-color var(--dur-short), box-shadow var(--dur-short);

    &:hover {
      border-color: var(--color-ink-2);
    }

    &.p-focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-dim);
    }
  }
}

.submit-btn {
  margin-top: var(--space-3xs);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  gap: var(--space-2xs);
  border-radius: var(--radius-btn);
  padding: 0.95rem 1.4rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);

  &:hover:not(:disabled) {
    background: oklch(0.7294 0.22 42);
    box-shadow: 0 4px 18px oklch(20% 0.012 50 / 0.15);
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
  background: var(--color-paper);
  z-index: var(--z-overlay) !important;
  border-radius: var(--radius-card);
  box-shadow: 0 4px 24px oklch(20% 0.012 50 / 0.12);
  border: 1px solid var(--color-rule);

  .p-select-list,
  .p-multiselect-list {
    background: var(--color-paper);
  }

  .p-select-option,
  .p-multiselect-option {
    font-family: var(--font-body);
    gap: 5px;
    padding: var(--space-2xs) var(--space-sm);
    transition: background var(--dur-micro) var(--ease-out);

    &:hover,
    &.p-focus,
    &[data-p-focused="true"] {
      background: var(--color-paper-2) !important;
      color: var(--color-ink);
    }

    &.p-selected,
    &[data-p-highlight="true"] {
      background: var(--color-accent-dim) !important;
      color: var(--color-accent);
    }

    &.p-selected:hover,
    &[data-p-highlight="true"]:hover {
      background: oklch(62% 0.22 42 / 0.18) !important;
      color: var(--color-accent);
    }
  }
}
</style>
