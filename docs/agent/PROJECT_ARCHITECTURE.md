# LUV Project Architecture

## Purpose

This file describes La Última Vigilia as one project with multiple technical and editorial homes.

The goal is not to force all material into one repository. The goal is to make ownership explicit.

## Component map

### 1. Public ecosystem

Repository: `ericescolero/la-ultima-vigilia`  
Branch: `main`

Owns:

- website;
- public pages;
- published Field Manuals;
- public content collections;
- lead magnets;
- public PDFs;
- newsletter/email architecture;
- public community architecture;
- courses/public ecosystem scaffolding;
- website deployment configuration;
- public-facing static assets.

### 2. Private Watchman brain

Repository: `ericescolero/watchman-universe-brain`

Current active development line: `phase-1-import`.

Owns current:

- owner decisions;
- canon;
- characters;
- forces of corruption;
- world model;
- locations;
- story development;
- novel/manuscript workflow;
- theology and eschatology governance;
- private production standards;
- visual canon;
- voice/quote production rules;
- Field Manual production rules;
- channel-role guidance.

Its own `AGENTS.md` is authoritative inside that repository.

### 3. Social publisher

Repository: `ericescolero/la-ultima-vigilia`  
Branch: `social-automation-bootstrap`  
Path: `automation/social-publisher/`

Owns:

- Cloudflare Worker implementation;
- D1 schema and content reservoir;
- generation queue;
- Workers AI generation;
- R2 media/reference handling;
- Meta/TikTok publisher adapters;
- cron triggers;
- admin health/queue/log/reference endpoints.

This implementation branch is not a substitute for canon. It consumes canonical rules.

### 4. Legacy archive

Repository: `ericescolero/pyrokryptic_ai`  
Path: `La Ultima Vigilia/`

Owns no new work by default.

Use it only for:

- historical source recovery;
- checking an old asset/version;
- migration provenance;
- explicitly requested comparisons.

## Dependency direction

The preferred direction is:

```text
Owner decisions / Scripture
        ↓
Private canon + theology + production brain
        ↓
Public content / website / social creative rules
        ↓
Automation implementations and channel outputs
```

The lower layer must not silently redefine the higher layer.

## Cross-component examples

### "Create a Mad Prophet social image"

Read:

1. private brain Mad Prophet canon;
2. private visual rules;
3. social branch visual profile/reference implementation if the automated Worker is involved.

Write only to the requested destination.

### "Update Manual 005"

Read:

1. private Field Manual production rules;
2. relevant canon/theology;
3. prior published manuals as public precedent.

Author the published manual in `content/field-manuals/` on the public repo.

### "Fix the Facebook queue"

Route to the social branch.

Do not edit canon merely because the queue generated a weak post. First determine whether the failure is:

- bad source data;
- bad prompt logic;
- stale visual profile;
- missing reference;
- platform failure;
- configuration state.

### "Change Watchman canon"

Route to the private brain.

Do not implement a canon rewrite by editing public website placeholders first.
