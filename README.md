# User Management System

A simple TypeScript-based CLI application for managing user data, utilizing features like enums, regular expressions, and file I/O.

## Features
- Add, update, delete, and manage users stored in a JSON file.
- Passwords are securely hashed using the `crypto` module.
- Command validation with regular expressions.
- Persistent user data storage in `users.json`.

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- npm (comes with Node.js)
- TypeScript (install globally via `npm install -g typescript`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vention-task-typescript
   cd src
    ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Compile and run
   ```bash
   tsc
   node taskManager.js
   ```

Commands:
- Adding <userId> <username> <password> - Adds a new user. Rejects duplicate userId.
- Deleting <userId> -Deletes the user with the given userId.
- Updating <userId> <username> <password> - Updates the user's details.
- Quit	Exits the application.
