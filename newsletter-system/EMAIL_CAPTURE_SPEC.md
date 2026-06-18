# EMAIL CAPTURE SPEC

## Purpose

Capture emails, deliver `La Guerra Silenciosa`, and move subscribers into the La Ultima Vigilia formation path.

---

## Version 1 Fields

```text
email
source
interest
language
```

---

## Required Tags

```text
lead-magnet-la-guerra-silenciosa
source-home
source-lead-magnet-page
source-blog
source-blog-article
source-footer
source-el-remanente
interested-el-remanente
language-spanish
```

---

## Provider Requirements

Email provider must support:

- API subscriber creation.
- Tags or segments.
- Automated delivery email.
- Unsubscribe handling.
- Broadcasts.
- Nurture sequences.

---

## Flow

```text
Submit form
→ validate email
→ add/update subscriber
→ apply source tag
→ apply interest tag
→ trigger delivery automation
→ redirect to /gracias
```

---

## Failure Handling

Failures must:

- Show clear user-facing error.
- Avoid silent form reset.
- Preserve entered email.
- Log provider/API error in future monitoring.

