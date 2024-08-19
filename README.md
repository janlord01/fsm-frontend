# Dental Forum Frontend

This is the frontend of the Dental Forum application, built using Quasar Vue.js. The app allows clients to ask questions, submit scorecards, and leave reviews for doctors.

## Features

- **Ask Questions:** Clients can ask questions to doctors.
- **Scorecards:** Submit a scorecard for a particular doctor.
- **Reviews:** Leave reviews and rate doctors.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd dental-forum-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configuration:**

   - Create an `.env` file in the root directory with the following environment variables:
     ```env
     VUE_APP_API_URL=<backend-api-url>
     VUE_APP_GOOGLE_CLIENT_ID=<google-client-id>
     VUE_APP_FACEBOOK_APP_ID=<facebook-app-id>
     ```

4. **Run the development server:**

   ```bash
   quasar dev
   ```

5. **Build for production:**
   ```bash
   quasar build
   ```

## Project Structure

- `src/boot/`: Boot files for global configuration.
- `src/pages/`: Vue components for pages.
- `src/layouts/`: Layout components.
- `src/components/`: Reusable components.
- `src/assets/`: Static assets (images, styles, etc.).
- `src/router/`: Routing configuration.
- `src/store/`: Vuex store configuration.

## Authentication

- **Google Authentication:** Implemented via OAuth2.
- **Facebook Authentication:** Implemented via OAuth2.

## API Communication

- **Axios:** Used for making API requests.
- **JWT Authentication:** Managed using LocalStorage.

## License

This project is licensed under the MIT License.
