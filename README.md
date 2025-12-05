# Singapore Lotto Results Web App

A modern Next.js application to display Singapore 4D, Toto, and Sweep results, with an admin dashboard for manual entry and a scraper integration.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    - Ensure you have a MySQL server running.
    - Create a `.env.local` file in the root directory with your database credentials:
      ```env
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_password
      DB_NAME=sg_lotto
      ADMIN_PASSWORD=admin123
      ```
    - Initialize the database tables by visiting: `http://localhost:3000/api/init-db` (after starting the server).

3.  **Run the Server**:
    ```bash
    npm run dev
    ```

## Features

-   **Public View**: Latest results for 4D, Toto, and Sweep.
-   **Admin Dashboard**: `/admin/encode` to manually enter results. Default password is `admin123` (or set `ADMIN_PASSWORD` in env).
-   **Scraper**: Trigger scraping manually via API: `http://localhost:3000/api/scrape`.

## Tech Stack

-   Next.js 14 (App Router)
-   Tailwind CSS
-   MySQL (mysql2)
-   Puppeteer (for scraping)
