# 🎉 Event Manager

An event management application designed to simplify the process of **creating, organizing, discovering, and managing events**. The application provides a centralized platform where users can manage event information and interact with event-related data through a modern web interface.

---

## 📌 Project Overview

**Event Manager** is a web-based application that helps organizers efficiently manage events and provides users with an easy way to access event information.

The application is designed to reduce manual event-management work by providing features such as event creation, event management, data storage, and a structured interface for working with event information.

The project uses **TypeScript, Vite, and Firebase/Firestore** for building and managing the application.

---

## ✨ Features

* 🎟️ Create and manage events
* 📅 Store event details such as date and time
* 📍 Manage event-related information
* 👥 Manage event participants/data
* 🔥 Firebase integration
* 🗄️ Firestore database support
* 🌐 Fast and modern Vite development environment
* ⚡ TypeScript-based development
* 🔐 Firestore security rules
* 🌱 Seed data support for initial/sample data
* 🖥️ Server-side functionality through `server.ts`

---

## 🛠️ Technologies Used

| Technology     | Purpose                             |
| -------------- | ----------------------------------- |
| **TypeScript** | Application development             |
| **Vite**       | Frontend development and build tool |
| **Firebase**   | Backend services                    |
| **Firestore**  | Database                            |
| **Node.js**    | Server-side runtime                 |
| **npm**        | Package management                  |
| **HTML5**      | Application structure               |
| **CSS**        | Styling                             |

---

## 📂 Project Structure

```text
Event-Manager/
│
├── .env.example
├── .gitignore
├── bun.lock
├── components.json
│
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
│
├── index.html
├── metadata.json
│
├── package.json
├── package-lock.json
│
├── seed-data.ts
├── server.ts
│
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 File Description

### `.env.example`

Contains example environment variables required by the application.

Sensitive credentials and API keys should **not** be committed to the repository.

Create your own `.env` file based on this example.

---

### `.gitignore`

Specifies files and folders that Git should ignore, such as:

* Environment files
* Dependencies
* Build files
* Temporary files
* Local configuration

---

### `package.json`

Contains:

* Project metadata
* Dependencies
* Development dependencies
* Available npm scripts

---

### `package-lock.json`

Locks the exact versions of installed npm dependencies to ensure consistent installations.

---

### `bun.lock`

Dependency lock file generated for the Bun package manager.

---

### `index.html`

The main HTML entry point of the Vite application.

---

### `vite.config.ts`

Contains the Vite configuration used for development and production builds.

---

### `tsconfig.json`

Contains TypeScript compiler configuration and project settings.

---

### `server.ts`

Contains the server-side functionality of the application.

It can be used to handle backend-related operations and application services.

---

### `seed-data.ts`

Contains initial/sample data that can be used to populate the application's database during development or testing.

---

### `firestore.rules`

Contains Firebase Firestore security rules that define how users and applications can access or modify Firestore data.

---

### `firebase-applet-config.json`

Contains Firebase-related application configuration used by the project.

---

### `firebase-blueprint.json`

Contains project-specific Firebase configuration/blueprint information.

---

### `components.json`

Contains configuration related to the application's component/UI setup.

---

### `metadata.json`

Contains project or application metadata.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project directory:

```bash
cd Event-Manager
```

---

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or, if you use Bun:

```bash
bun install
```

---

### 3. Configure Environment Variables

Create a `.env` file from `.env.example`.

```bash
cp .env.example .env
```

On Windows, you can also manually create a file named:

```text
.env
```

Then add the required environment variables.

> **Important:** Never upload private API keys, passwords, service-account credentials, or other secrets to GitHub.

---

## 🔥 Firebase Setup

The application uses **Firebase/Firestore** for backend data storage.

Before running the application, make sure your Firebase project is configured correctly.

### Required steps

1. Create a Firebase project.
2. Enable **Firestore Database**.
3. Configure the required Firebase application settings.
4. Configure the required environment variables.
5. Apply the Firestore security rules from:

```text
firestore.rules
```

6. Add any required initial data using:

```text
seed-data.ts
```

---

## ▶️ Running the Application

Start the development server using:

```bash
npm run dev
```

Vite will start the development server.

Open the URL displayed in your terminal, commonly:

```text
http://localhost:5173
```

---

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Development

During development, you can use the following workflow:

```text
User
  │
  ▼
Event Manager UI
  │
  ▼
Application Logic
  │
  ├──────────────► Server
  │
  ▼
Firebase / Firestore
  │
  ▼
Event Data
```

---

## 🔐 Security

The project uses Firestore security rules to control access to database resources.

For production deployment:

* Do not commit `.env` files.
* Do not expose private API keys.
* Use appropriate Firestore security rules.
* Validate user input.
* Restrict database access according to user roles.
* Use HTTPS in production.
* Regularly review Firebase permissions.

---

## 📋 Example Event Information

An event can contain information such as:

```text
Event Name: Tech Conference 2026
Date: 20 October 2026
Time: 10:00 AM
Location: Bengaluru
Category: Technology
Description: A technology conference for developers and students.
```

---

## 🎯 Use Cases

### Event Organizers

Organizers can use the application to:

* Create events
* Update event information
* Manage event data
* Monitor participants
* Maintain event records

### Participants

Users can use the application to:

* Discover events
* View event details
* Check event schedules
* Register for events
* Keep track of upcoming events

---

## 🔮 Future Enhancements

The application can be extended with:

* 👤 User authentication and role-based access
* 🎫 Online event registration
* 📱 QR-code-based event check-in
* 📧 Email notifications
* 🔔 Push notifications
* 💳 Online payment integration
* 📊 Event analytics dashboard
* 🗺️ Interactive venue maps
* ⭐ Event ratings and reviews
* 📱 Mobile application
* 🤖 AI-based event recommendations

---

## 🤝 Contributing

Contributions are welcome.

### Steps

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add new feature"
```

5. Push the branch.

```bash
git push origin feature/new-feature
```

6. Create a Pull Request.

---

## 📜 License

This project is intended for educational and development purposes.

If you plan to distribute the project publicly, add an appropriate open-source license such as MIT.

---

## 👨‍💻 Author

**Yuvaraj Kumar**

Computer Science & Engineering

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

### 📌 Project Summary

**Event Manager** is a modern event-management application built using **TypeScript, Vite, Firebase, and Firestore**. It provides a centralized platform for organizing event information and can be extended with authentication, registration, notifications, analytics, and other event-management capabilities.
