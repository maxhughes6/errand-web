<template>
  <footer id="footer" aria-label="Site footer">
    <hr class="footer-rule" aria-hidden="true" />
    <div class="footer-line">
      <span>© 2026 ErrandAI</span>
      <span class="footer-sep" aria-hidden="true">·</span>
      <span>Built by Max Hughes</span>
      <span class="footer-sep" aria-hidden="true">·</span>
      <span class="footer-note">Demonstration project only — not a commercial product</span>
    </div>
  </footer>
</template>

<style scoped>
#footer {
  width: 100%;
  padding: 0 var(--space-lg) var(--space-md);
  flex-shrink: 0;
}

.footer-rule {
  border: none;
  border-top: 1px solid var(--color-rule);
  margin: 0 0 var(--space-sm) 0;
}

.footer-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
}

.footer-sep {
  color: var(--color-rule);
  user-select: none;
}

.footer-note {
  font-style: italic;
}

@media (max-width: 640px) {
  .footer-note { display: none; }
}
</style>
