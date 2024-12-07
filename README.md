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
- **Date fns**: For Date manipulation
- **Zustand**: For Global State Management
- **Lottiefiles** : For animated illustration
- **Stripe** : For payment

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

### 4. Product with TipTap (Rich Text Editor)

- For Rich Text Editor to add description

### 5. Product List with TanStack Table

- For listing product in table with search filter and paginations

### 6. Model Relation for Product, productVariant, variantImages, variantTags

- Relation established with one to one and one to many on models

re! Here's a detailed README.md section for the InputTags component in Markdown format:

### 7. InputTags Component Implementation Details

The `InputTags` component is used to manage a list of tags that can be added and removed dynamically. This implementation uses React hooks and animation for smooth transitions and a user-friendly experience.

1. **Tag Management**

   - Allows users to add tags by typing and pressing "Enter".
   - Tags can be removed by clicking the "X" button next to each tag.

2. **Dynamic Tag List**

   - The tags are stored as an array of strings and displayed as badges.
   - The list updates dynamically when tags are added or removed.

3. **State Management**

   - Uses `useState` to track the current input (`pendingDataPoint`) and whether the input field is focused (`focused`).
   - The `value` prop is passed from the parent component, and the `onChange` function is used to update the list of tags.

4. **Focus Management**

   - The component sets focus on the input field when clicked using `useFormContext`'s `setFocus` method from `react-hook-form`.

5. **Smooth Animations**

   - Animations are handled with the `motion.div` from `motion/react` to provide a smooth enter and exit transition when adding or removing tags.

6. **Input Field Behavior**

   - On pressing "Enter", the current value is added as a new tag if it is non-empty.
   - On pressing "Backspace" when the input field is empty, the last tag in the list is removed.

7. **Customizable Props**

   - The component accepts all `InputProps` from the `Input` component, including any styling or custom properties.

8. **Styling**

   - The component is styled using utility classes from Tailwind CSS, allowing for flexibility in layout and appearance.

9. **Reusability**

   - This component is highly reusable across different forms or interfaces requiring tag input.

10. **Error Handling**
    - The component can handle form validation errors seamlessly as part of the parent form's validation.

### 8. Product Variant Implementation Details

1. **Form Handling**

   - Managed using `react-hook-form` with `zodResolver` for robust form validation and state management.

2. **Dynamic Initialization**

   - The form fields are pre-populated dynamically in `editMode` using incoming variant props.

3. **UI Components**

   - Built with reusable components like `Dialog`, `FormField`, `Input`, and `Button` for consistent styling and functionality.

4. **Custom Inputs**

   - Includes `InputTags` for managing tags and `VariantImages` for handling variant images.

5. **Data Mapping**

   - Maps `variantTags` and `variantImages` from the incoming data to form fields for seamless editing.

6. **Server-Side Actions**

   - Integrated server actions (`createVariant`, `deleteVariant`) to handle backend operations securely.

7. **Real-Time Feedback**

   - Provides user feedback with `sonner` toasts for success, error, and execution states.

8. **State Management**

   - Dialog visibility and `editMode` logic controlled using `useState` and `useEffect` hooks.

9. **Customization**

   - Includes fields for variant title, color picker, tags, and images to allow flexible configurations.

10. **Validation and Messages**
    - Ensures data accuracy with validation rules and displays errors or status updates using `FormMessage`.

### 9. Stripe Implementationa

1. Sign up to stripe account and get the **public** and **secret** keys and store in **.evn** file

2. Install 3 different packages:

   ```
   npm i @stripe/react-stripe-js @stripe/stripe-js stripe

   ```

3. Create a lib/get-stirpe.ts and export Stripe using **public** key for initialization on need

4. Create **Payment** Component using **Elements** from **_@stripe/react-stripe-js_** which takes the exported **stripe** init and its **options**: **_mode, currency, amount_** for payment.

5. Create **PaymentForm** Component For **Elements** wrapper. Once, **Element** wrapper is covered, **PaymentForm** now can use various hooks to work with stripe.

   > **Hooks:** from **_@stripe/react-stripe-js_**

   - **stripe** from **useStripe()**
   - **elements** from **useElements()**
   - **cart** from zustand **useCartStore()**

   > Modules from **_@stripe/react-stripe-js_**

   - **PaymentElment** | **AddressElement** for form

   - Create `<form>` with **PaymentElment** | **AddressElement**, address takes **options** **_{mode: shipping | billing}_**

6. Create **PaymentIntent**, when User wants to pay for something stripe requires  paymentintent which passess amount and product metadata. Though there are alternate to paymentintent, aka server action
 




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
