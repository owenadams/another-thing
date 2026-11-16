# Another Thing

A local-first learning app for short, personalised discoveries. Open `index.html` in a browser to use it, or host the folder as a static site such as GitHub Pages. No build step is required.

Choose your interests, then add a Gemini API key in Settings. Each new discovery uses Gemini to select a subject, retrieves a Wikipedia article, and asks Gemini to write a lesson and quiz based on that source. Explore creates an extra lesson without replacing today's discovery. A lesson is generated only when requested, not automatically in the background.

The app stores the key, interests, feedback and lessons in browser storage on that device. The key is not encrypted, and scripts running on the site or someone with access to the browser can read it. Content and preferences used in prompts are sent to Google; search terms are sent to Wikipedia. Browser data can be cleared or lost, and it does not sync across devices. Saved lessons can be exported as Markdown; the export does not include your API key.

Gemini API limits and charges depend on your Google account, model and billing settings. A Gemini subscription does not necessarily include API usage. Each user should supply their own key and check their quota. AI responses can contain errors even when a source is provided; consult the linked article. Wikipedia images may have different licences; follow the source link to check attribution and reuse terms. Read-aloud voices depend on the browser and operating system.

Run the local state tests with:

```sh
node --test tests/core.test.cjs
```