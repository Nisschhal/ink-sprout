# InkSprout 🌱

**InkSprout** is an e-commerce platform for quality stationery 🖊️🖍️, providing a curated selection of pens, highlighters, and accessories for creatives. Built with Next.js, it offers a seamless shopping experience for artists, writers, and stationery lovers.

## Features

- **Product Showcase**: Beautifully displays products with options to filter by type, color, and brand.
- **Secure Authentication**: User registration and login functionality.
- **Cart & Checkout**: Add products to the cart and complete purchases securely with Stripe integration.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: Next.js, TailwindCSS
  - **React Icons**
  - **React Hook Form**
  - **@hookform/resolvers**: to pass the form data to zod for validation
  - **Zod**: for form Validation schemas
- **Backend**:
  - **Drizzle with PostgreSQL**: for database
  - **NeonDb**: for serveless db
  - **Next Safe Action**: for
  - **Bcrypt**: To hash register password
  - **Resend**: For EmailVerification and its stuff.
- **Database**: PostgreSQL with Drizzle and Neondb server
- **Payment Processing**: Stripe
- **State Management**: Redux (or Context API)
- **Deployment**: Vercel for frontend, Heroku for backend (or choose based on preference)
- **UploadThings**: For image upload
- **TipTap**: For Rich Text Editor
- **Sonner**: For Notification Toast

## Implementation Details (./server)

### 1. Database Setup Dirzzle: PostgreSQL with Neon Server

- Setup the neon project and copy `Connection string` from dashboard as a serverless database provide
  - create .env and set DATABASE_URL=Connection string
- Drizzle with Neon Postgres docs(https://orm.drizzle.team/docs/tutorials/drizzle-with-neon)
- Verify by migrating to db

_Note: **db** connection should be in `./server/index.ts` where as **schema** should be in `./server/schema.ts`_

### 2. Next-Auth.js (with Drizzle)

- Setup as instructed in docs: (https://authjs.dev/getting-started/adapters/drizzle)
  - Only copy the **users**, and **accounts** schemas. Don't copy all as it contains db connection code as well, which we've already done in `./index.ts`
- Add the neccessary **Providers[]** for `./auth.ts`, such as Google, Github and so on according to need.
  1. Get the GITHUB_ID and GITHUB_SECRET key from the `github/setting/developer-setting/oath-apps` and get the **client_id** and **client_secret** from there.
  2. Get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
     - get into `https://console.cloud.google.com/`
     - create new project
     - get into dashboard
     - get to the **APIs and Services**
     - go to Credentials and create `OAuth Client ID`
     - Once created, again to to the Credentials and select `OAuth Cliet ID`, which now will give you application type options: pick **web**
       - Now set up
         - **Authorized JS origins** --> `http://localhost:3000`
         - **Authorized redirect URIs** --> `http://localhost:3000/api/auth/callback/google`
  - Now copy the given Client ID and Secret key

_Note: Don't forget to add AUTH_SECRET in `./server/auth.ts` by doing `npx auth || secret` as handlers requires it and add **session.strategy: 'jwt'** for not defaulting to session schema_

### 3. Upload Thing Image Upload

- For changing profile pic | avatar image

### 4. Product with TipTap

- For Rich Text Editor to add description

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inksprout.git
   ```
2. Navigate to the project directory:
   ```bash
   cd inksprout
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env.local` file in the root directory with the following:
     ```env
     NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Access the app at `http://localhost:3000`.
   pgTable

## Project Structure

- `/pages`: Next.js routing and page components.
- `/components`: Reusable UI components.
- `/lib`: Helper functions and configurations.
- `/api`: Backend API routes for authentication, products, and checkout.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
