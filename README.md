# Ascendion Tech Assessment (Next.js + Redis)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It includes Redis integration and unit tests using Jest and TypeScript.

## Getting Started

### 1. Install Dependencies

```bash
npm install
````

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
SECRET=ascendion_tech_assessment
REDIS_URL=redis://localhost:6379
```

These environment variables are used for secure word generation and Redis-based session handling.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Tests

```bash
npm test
```

> Tests are written using Jest with TypeScript. The test environment loads `.env` using `dotenv/config`.

---

## Project Structure

* `app/api/` - Route handlers (Next.js API)
* `__test__/` - Unit tests
* `libs/redis.ts` - Redis client with safe lazy connection
* `utils/HttpStatus.ts` - Custom HTTP status codes

---

## Learn More

* [Next.js Documentation](https://nextjs.org/docs) - Learn about features and APIs.
* [Next.js Tutorial](https://nextjs.org/learn) - Interactive beginner tutorial.
* [Next.js GitHub](https://github.com/vercel/next.js) - Contribute or browse the source.

---

## Deployment

The easiest way to deploy this app is using [Vercel](https://vercel.com/new?utm_source=create-next-app&utm_medium=readme). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.