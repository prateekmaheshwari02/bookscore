# BookScore

BookScore is a minimum viable product for measuring how deeply a reader understands a non-fiction book. It generates a conceptual multiple-choice quiz, evaluates the reader's answers with AI, and returns a scorecard with strengths, weak concepts, feedback, and suggested topics to revisit.

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Node.js API routes
- OpenAI API
- Temporary browser session storage for MVP state

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your OpenAI API key to `.env.local`:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## OpenAI API Key Setup

BookScore works in Demo Mode without an API key, but the real product experience needs an OpenAI API key.

1. Go to the OpenAI API dashboard: `https://platform.openai.com/api-keys`
2. Sign in or create an OpenAI account.
3. Create or select a Project for BookScore.
4. Create a new API key for this project.
5. Copy the key once. Store it safely because you may not be able to view the full key again.
6. Open `.env.local` in this project and set:

   ```bash
   OPENAI_API_KEY=your_real_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```

7. Restart the development server after changing `.env.local`.

## Google Sheets Feedback Capture

BookScore can send quiz sessions and feedback to Google Sheets through a Google Apps Script web app.

1. Create a Google Sheet with a tab named `Responses`.
2. Add this header row:

   ```text
   timestamp | eventType | sessionId | userName | bookName | score | rating | comment | mode
   ```

3. In the sheet, go to `Extensions -> Apps Script`.
4. Paste this script:

   ```js
   const SHEET_NAME = "Responses";

   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
     const data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       data.timestamp || new Date().toISOString(),
       data.eventType || "",
       data.sessionId || "",
       data.userName || "",
       data.bookName || "",
       data.score ?? "",
       data.rating ?? "",
       data.comment || "",
       data.mode || ""
     ]);

     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

5. Click `Deploy -> New deployment`.
6. Choose `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Deploy and copy the web app URL.
10. Add the URL to `.env.local` locally and to Vercel environment variables:

   ```bash
   GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_web_app_url_here
   ```

The quiz still works if this URL is missing. It just skips saving analytics and feedback.

## API Key Safety

- Never paste the API key into the browser UI.
- Never commit `.env.local` to Git.
- Keep the key on the server only. This app uses Next.js API routes so browser code calls `/api/generate-quiz` and `/api/evaluate`, while the key stays in server-side environment variables.
- Use one key per project or environment when possible.
- If a key is exposed, delete it in the OpenAI dashboard and create a new one.
- Set project usage limits in the OpenAI dashboard before sharing or deploying the app.

## App Flow

1. The user starts on the BookScore landing page.
2. The setup page collects the user's name and the book name.
3. `/api/generate-quiz` asks OpenAI for 10 conceptual MCQ questions.
4. The quiz page collects one answer per question.
5. `/api/evaluate` calculates the score and asks OpenAI for personalized feedback.
6. The results page shows score, strengths, weak concepts, and reread suggestions.

## Notes

- The MVP does not use a database.
- Quiz and result state are stored in `sessionStorage`, so a browser session refresh can keep the current flow but a new session starts clean.
- The score is calculated server-side from the generated correct answers, then passed to OpenAI so feedback cannot alter the numeric grade.
- If a model is not set, the app uses `gpt-4.1-mini` by default. You can change this with `OPENAI_MODEL`.
