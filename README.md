# tRPC Chat App

### A simple chat app based on tRPC and NextJS

https://trpc-next-mongo-chat-room.vercel.app/

![Tests Status](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)

### Running Locally

    pnpm install
    pnpm run dev

### Testing

    pnpm run test
    pnpm run test:watch

### Lint

    pnpm run lint

### Tech Stack

- **tRPC** for typesafe client-server communication
- **NextJS** for frontend and serverless api routes
- **MongoDB** as NoSQL database (hosted on Atlas)
- **ts-mongo** as a typesafe MongoDB client ([forked](https://github.com/MohammedMaaz/ts-mongo) version)
- **AWS S3** bucket as an object storage to save images
- **Zod** for schema validation of APIs and MongoDB
- **Mantine** as a UI components library
- **Jest** and **React Testing Libarary** for integration tests
- **ES Lint** and **Prettier** for code linting and formatting
- **pnpm** as a package manager
- **Vercel** for hosting and CI

### Features

- Infinite scrolling
- Images uploading through **clipboard** paste or via file upload
- Multiline inputs **(Shift + Enter)**, and **Enter to send** feature
- Image zoom/**spotlight mode** (click image to open in spotlight)
- **Central error handling** through mantine notifications
- Whatsapp-like **responsive chat bubbles** and images
- ES Lint and prettier for **better DX**
- **Infinite scroll tests** through Jest
- Github actions **CI workflow** for Jest
