# Wizro Portal

## Table of Contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [Database Migration](#database-migration)
* [SQL File Structure](#sql-file-structure)
* [Writing New SQL Migrations](#writing-new-sql-migrations)
* [Code Quality](#code-quality)
* [Git & Collaboration](#git--collaboration)
* [Important Notes](#notes)

---

## Prerequisites

Before starting, make sure you have installed:

* Node.js (v18+ recommended)
* npm or yarn
* PostgreSQL (v10+ recommended)
* Git

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Nazneenp/wizro.ai.git
cd wizro.ai
```

2. Install Husky dependencies:

```bash
npm install
npm run prepare
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd frontend
npm install
```

5. Rename the `.env.example` file in the backend root to `.env` and enter your credentials.

---

## Running the Project

### Backend

```bash
cd backend
npm run dev
```

The server will run on the configured port (e.g., `http://localhost:5000`).

### Frontend

```bash
cd frontend
npm run dev
```

The React app will run on `http://localhost:5173`.

---

## Database Migration

All database schema changes and seed data are handled by `migrate.js`.

### Steps to Run Migrations

1. Make sure your `.env` file is configured properly.
2. Place your SQL files in the `database_schema` folder:

```
database_schema/
├── tables/
├── views/
└── functions/
```

3. Use `npm run migrate:newtable filename` to create a new file for a table. For views or functions, create the file manually:

```
1761474940_tbl_users.sql
1761474971_tbl_role_master.sql
1761474990_tbl_pm_group_master.sql
```

4. Run the migration script:

```bash
npm run migrate:reset               # Reset the database
npm run migrate:up                  # Apply migrations and seed the database
npm run migrate:newtable filename   # Create a new SQL file for your table
```

✅ The script will automatically sort files numerically and apply them in order.

---

## SQL File Structure

* **tables/** → Table creation scripts
* **views/** → Database views
* **functions/** → Stored functions

`npm run migrate:newtable filename` ensures execution order.

* SQL files must use valid PostgreSQL syntax.
* Use `INSERT` statements for seeding data (avoid `COPY FROM stdin`).

---

## Writing New SQL Migrations

1. Create a new `.sql` file for a table using `npm run migrate:newtable filename`.
2. Write schema changes or seed data in standard PostgreSQL SQL.
3. Add the file to the appropriate folder (`tables`, `views`, etc.).
4. Run `npm run migrate:up` to apply the changes.

---

## Code Quality

We use **ESLint** and **Prettier** to enforce consistent code style across both backend and frontend projects.

### Local Linting & Formatting

Each subproject has its own scripts:

**Backend (`backend/package.json`):**

```bash
npm run lint            # Check for ESLint issues
npm run lint:fix        # Automatically fix ESLint issues
npm run format          # Format code using Prettier
npm run format:check    # Check formatting using Prettier
```

**Frontend (`frontend/package.json`):**

```bash
npm run lint            # Check for ESLint issues
npm run lint:fix        # Automatically fix ESLint issues
npm run format          # Format code using Prettier
npm run format:check    # Check formatting using Prettier
```

> ⚡ Tip: Always run `npm run lint:fix` followed by `npm run format` before committing to automatically fix most issues.

---

## Git & Collaboration

1. Clone the repo and create a feature branch:

```bash
git checkout -b issue/{issue_no}_{issue_name}
```

> **Note:** `{issue_no}` refers to the issue number and `{issue_name}` refers to the name assigned to you.

2. Make your changes and add new SQL files if needed.
3. Commit with a clear message:

```bash
git add .
git commit -m "Brief explanation of the issue or fix"
```

> **Note:** We have a pre-commit hook that checks for ESLint and Prettier errors.
> If your commit fails, ensure all linting and formatting issues are resolved.

4. Push to GitHub:

```bash
git push origin issue/{issue_no}_{issue_name}
```

5. Create a Pull Request (PR) to merge into the `development` branch.
6. A GitHub workflow will automatically run on every PR.
   Please make sure to run the following commands **before opening a PR** to avoid merge failures:

```bash
npm run lint:fix
npm run format
```

---

## Notes

* Always **run migrations locally** before pushing PRs that include database changes.
* Keep numeric prefixes in order to avoid conflicts.
* Use descriptive commit messages to make collaboration easier.
* ESLint and Prettier configs are included in each subproject (`eslint.config.js` and `.prettierrc`).
