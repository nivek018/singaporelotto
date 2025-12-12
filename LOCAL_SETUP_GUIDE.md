# Local Setup Guide

This guide will help you set up and run the SG Lotto Results application on your local machine.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **MySQL**: Ensure you have a MySQL server running.

## Configuration
The `.env` file has already been configured with the credentials you provided:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=sg-pwedeh
ADMIN_PASSWORD=admin123
```

## Setup & Run

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Initialize Database**:
    This script will create the database `sg-pwedeh` and necessary tables if they don't exist.
    ```bash
    npm run db:init
    ```

3.  **Run the Application**:
    ```bash
    npm run dev
    ```
    
    > **Note for Windows PowerShell users**: If you encounter a security error running `npm run dev`, try checking your execution policies or simply run:
    > ```bash
    > cmd /c npm run dev
    > ```

4.  **Access the App**:
    Open [http://localhost:3018](http://localhost:3018) in your browser.

## Troubleshooting
- **Database Connection Error**: Double-check your MySQL server is running and the credentials in `.env` match your local setup.
- **Port In Use**: If port 3018 is taken, modify `package.json` scripts to use a different port.
