# Anand Prakash Portfolio

Static, responsive portfolio built with semantic HTML, CSS and vanilla JavaScript. Project content lives in `project-data.js`, separate from the interaction logic in `script.js`.

## Engineering Lab

The Engineering Lab is intentionally self-contained:

- The AI Workflow Playground is a simulated client-side workflow. It does not call an LLM or execute tools.
- The API Explorer uses local mock responses only. It does not make network requests or contact a backend.
- The Data-to-Insights Lab uses a small synthetic dataset created for illustration. It is not a personal project result or business dataset.

The lab logic is in `lab.js`; no API keys, backend routes, or additional dependencies are required.

## Profile content

Resume-backed About, skills, education and certifications data is maintained in `profile-data.js`. Certification entries intentionally show only the issuer/course context present in the resume; no IDs, verification links or completion dates are inferred.

## Phase 6

- The command palette opens with `Cmd+K` on macOS or `Ctrl+K` elsewhere and uses local section/resume actions.
- Case studies use the static route `project.html?slug=<slug>` and render only projects with resume-backed content. Verified repository, demo and screenshot URLs are intentionally absent until supplied.
- No visitor analytics or third-party tracking is configured.

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Contact form

The form intentionally opens a pre-filled email draft using `mailto:`. It does not pretend to submit successfully or store user data. For hosted form submission, replace the submit handler in `script.js` with a configured provider endpoint and keep credentials server-side.

## Deploy to Vercel

Import this folder as a project in Vercel. No build command or environment variables are required because it is a static site. The included PDF is linked from the root and will be downloadable after deployment. Add the final deployed absolute URL to a sitemap before publishing if search-engine sitemap discovery is required; no deployed domain is verified in this repository.

## Missing project assets

The resume provides profile and project information, but no verified project-specific repository or live-demo URLs. The project cards therefore link only to Anand's GitHub profile and do not imply that any project is deployed.
