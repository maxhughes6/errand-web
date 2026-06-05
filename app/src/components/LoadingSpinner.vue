<script setup>
defineProps({
    message: {
        type: String,
        default: 'Loading...'
    }
});
</script>

<template>
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ message }}</p>
    </div>
</template>

<style scoped lang="scss">
    .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4713a3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    p {
        color: #666;
        font-size: 1.1rem;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>