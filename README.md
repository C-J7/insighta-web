# Insighta Labs+ Web Portal

A secure, intuitive dashboard for non-technical users to access the Insighta Profile Intelligence System.

## Architecture & Security

Built with React (Vite) and Axios, this portal strictly adheres to the Stage 3 security requirements:

* **HTTP-Only Cookies:** Authentication tokens are issued as secure, HTTP-only cookies by the backend. They are never stored in `localStorage` or accessible via JavaScript, mitigating XSS attacks.
* **CSRF Mitigation:** Cookies are configured with `SameSite=Lax` to prevent cross-site request forgery.
* **Axios Integration:** The API client is configured with `withCredentials: true` to seamlessly attach identity to all requests.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
