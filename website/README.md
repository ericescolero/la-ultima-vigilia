# La Ultima Vigilia Website

Version 1 is a fast, static-first website focused on:

- Email capture
- `La Guerra Silenciosa` delivery
- Mission clarity
- El Remanente introduction
- Future expansion into blog, courses, membership, and archive systems

Run locally:

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:4173
```

The email capture flow submits to the configured MailerLite public form endpoint. Each form sends the email value as `fields[email]` and redirects successful signups to `/bienvenido/`.

Do not commit MailerLite API keys. Server-side API integration should be added only when a backend or serverless function exists.
