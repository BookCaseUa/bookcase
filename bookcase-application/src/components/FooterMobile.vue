<template>
    <v-footer class="footer">
      <div class="footer-links">
        <router-link to="/contacto">{{ $t("footer.contacto") }}</router-link>
        <a href="https://www.facebook.com/profile.php?id=61573999274472" target="_blank" rel="noopener">
          <i class="fab fa-facebook"></i>
        </a>
        <a href="https://x.com/BookCaseUa" target="_blank" rel="noopener">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
        <a href="https://www.instagram.com/bookcaseua2025/" target="_blank" rel="noopener">
          <i class="fab fa-instagram"></i>
        </a>
        <router-link to="/politicas">{{ $t("footer.politicasLegales") }}</router-link>
      </div>
      <div class="footer-copy">
        {{ new Date().getFullYear() }} — <strong>BookCase</strong>
      </div>
    </v-footer>
</template>  
  
<style scoped>
.footer {
  height: 3.5rem;
  max-height: 3.5rem;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 0.4rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-copy {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Opcional: ajustar aún más en móviles */
@media (max-width: 375px) {
  .footer-links {
    gap: 12px;
    font-size: 0.85rem;
  }

  .footer-copy {
    font-size: 0.7rem;
  }
}

</style>
  