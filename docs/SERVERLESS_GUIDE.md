# Helper Guide: Serverless Functions

This guide explains how the serverless backend works in SwipeScout, specifically looking at the `api/waitlist.js` function we just created.

## What is a Serverless Function?

A serverless function is a piece of code that runs on-demand in the cloud. You don't manage a server; you just write the function, and the platform (Vercel) handles the rest. This is perfect for handling secret API keys (like Notion) that you can't expose in the frontend.

## How it Works in this Project

In a Vercel-hosted project, any file inside the `api/` directory is automatically turned into an API endpoint.

-   **File**: `api/waitlist.js`
-   **URL**: `https://your-site.com/api/waitlist`

### The Code Breakdown (`api/waitlist.js`)

```javascript
// 1. Import the Notion Client
import { Client } from '@notionhq/client';

// 2. Initialize with your SECRET key (Process.env keeps it safe on the server)
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 3. The Handler Function (Requests come in here)
export default async function handler(request, response) {
  
  // Security: Only allow POST requests (sending data)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Get data from the frontend
  const { email } = request.body;

  try {
    // Call the Notion API
    await notion.pages.create({ ... });
    
    // Send success back to the frontend
    return response.status(200).json({ success: true });
  } catch (error) {
    // Handle errors
    return response.status(500).json({ error: error.message });
  }
}
```

## How to Create a New Function

1.  Create a file in the `api/` folder (e.g., `api/hello.js`).
2.  Export a default function:
    ```javascript
    export default function handler(req, res) {
      res.status(200).json({ message: 'Hello World' });
    }
    ```
3.  Deploy or run locally.

## How to Run Locally

Since this is a backend function, the standard `npm run dev` (Vite) **does not** know how to run it. You need the Vercel CLI.

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```
2.  **Run Development Server**:
    ```bash
    vercel dev
    ```
    This starts a server that handles both your frontend (Vite) and your backend (`api/`) functions together.
