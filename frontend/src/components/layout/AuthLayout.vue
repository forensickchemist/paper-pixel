<template>
  <section class="auth-section">
    <div class="container-fluid">
      <div class="row min-vh-100">

        <!-- Left Image -->
        <div class="col-lg-6 auth-image">
          <div class="auth-image-overlay">
            <div class="auth-branding">
              <h1>Paper Pixel</h1>
              <p>
                A cozy place for stories worth keeping.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Form -->
        <div
          class="col-12 col-lg-6 d-flex align-items-center justify-content-center"
        >
          <div class="auth-form-wrapper w-100">
            <slot />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-section {
  min-height: 100vh;
  background-color: var(--color-background);
}

/* Left Image */

.auth-image {
  display: none;

  background-image:
    linear-gradient(
      rgba(46, 36, 27, 0.35),
      rgba(46, 36, 27, 0.35)
    ),
    url("@/assets/images/auth-background.jpeg");

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.auth-image-overlay {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  padding: var(--space-7);
}

.auth-branding {
  max-width: 420px;
  text-align: center;
  color: white;
}

.auth-branding h1 {
  margin-bottom: var(--space-3);

  color: white;
  font-family: var(--font-heading);
  font-size: var(--fs-3xl);
}

.auth-branding p {
  margin: 0;
  font-size: var(--fs-md);
}

/* Form */

.auth-form-wrapper {
  max-width: 520px;
  padding: var(--space-6);
}

/* Desktop */

@media (min-width: 992px) {
  .auth-image {
    display: block;
  }

  .auth-form-wrapper {
    padding: var(--space-7);
  }
}

/* Mobile */

@media (max-width: 991.98px) {
  .auth-form-wrapper {
    padding: var(--space-5);
  }
}
</style>