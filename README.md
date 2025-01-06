# Simple Forum Application

This is a basic forum application built with [NestJS](https://nestjs.com/). The main goal of this project was to explore **Domain-Driven Design (DDD)** concepts and integrate modern technologies like **Prisma**, **Redis**, and **Cloudflare R2** for image storage. It was designed as a learning project and is not intended for production use.

---

## 🚀 Technologies Used

- **NestJS**: A progressive framework for building scalable Node.js applications.
- **Prisma**: A next-generation ORM for efficient and type-safe database access.
- **Redis**: Used as a caching layer to enhance application performance.
- **Cloudflare R2 (S3-compatible)**: For handling file uploads and image storage.
- **TypeScript**: For static typing and robust development.

---

## 🛠️ Project Structure

This project follows a **Domain-Driven Design (DDD)** inspired architecture, with a clear separation of concerns:

- **Domain**: Contains business rules and domain models.
- **Application**: Use cases and application services.
- **Infrastructure**: Database repositories, cache implementations, and external integrations.
- **Interface**: Responsible for routes and adapters (controllers in NestJS).

---

## 📦 Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/) (optional, for Redis)
- A database compatible with Prisma (e.g., PostgreSQL)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```

### TO DO

[ ] build frond-end
