<template>
    <v-footer class="footer">
      <div class="footer-links">
        <!-- Internas: usar router-link -->
        <router-link to="/contacto">{{ $t("footer.contacto") }}</router-link>
        <a
          href="https://www.facebook.com/profile.php?id=61573999274472"
          target="_blank"
          rel="noopener"
          ><i class="fab fa-facebook"></i
        ></a>
        <a
          href="https://x.com/BookCaseUa"
          target="_blank"
          rel="noopener"
          ><i class="fa-brands fa-x-twitter"></i
        ></a>
        <a
          href="https://www.instagram.com/bookcaseua2025/"
          target="_blank"
          rel="noopener"
          ><i class="fab fa-instagram"></i
        ></a>
        <router-link to="/politicas">{{ $t("footer.politicasLegales") }}</router-link>
      </div>
      <div class="footer-copy">
        {{ new Date().getFullYear() }} — <strong>BookCase</strong>
      </div>
    </v-footer>
  </template>
  
  
  <style scoped>
  .footer {
    height: 4rem;
    max-height: 4rem;
    background-color: #2c3e50;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 1000;
  }
  
  .footer-links {
    margin-top: 2rem;
  }
  
  .footer-links a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  
  .footer-copy {
    font-size: 0.75rem; /* similar a text-caption */
    font-weight: 400; /* similar a font-weight-regular */
    opacity: 0.6; /* similar a opacity-60 */
    margin-top: 0.2rem;
    margin-bottom: 1.5rem;
  }
  </style>
  