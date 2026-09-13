# Cuddy

**Cuddy** is an AI-assisted football (soccer) match-analysis desktop app. It
pairs the reliability of professional video-coding software (customisable tag
buttons, a linked timeline, descriptors, XML/CSV export) with a computer-vision
and LLM layer that suggests events, maps the pitch, and answers questions in
plain English over your own footage.

The design stance is **AI-assisted, not fully automated**: every machine output
is a reviewable suggestion, rendered with visible confidence, sitting on the
same timeline you hand-correct. The tool never fetches, hosts, or redistributes
footage — it only reads files you already have on disk.

## Where the code lives

The application is in **[`football-analysis/`](football-analysis/)** — see its
[README](football-analysis/README.md) for the stack, setup, and run commands,
and [`docs/architecture.md`](football-analysis/docs/architecture.md) for how the
pipeline is built.

```
project/
├─ football-analysis/   the Cuddy app (frontend, Rust shell, Python sidecar)
├─ docs/index.html      the public landing page (served via GitHub Pages)
└─ CLAUDE.md            working rules + conventions for AI contributors
```

## Links

- **Download (Windows):** https://github.com/saifestabraq-cell/cuddy/releases/latest
- **Landing page:** https://saifestabraq-cell.github.io/cuddy/

## Roadmap

Phases 0–3 (manual coding, CV detection/tracking/teams, fixed-camera heatmaps,
possession/passing, shots/xG, natural-language query) are complete. Ongoing work
follows the implementation spec: a durable staged pipeline, a validation
harness, footage triage, an event timeline, a faster coding loop, clip-returning
interrogation, and an approximate spatial layer — each shipped incrementally.
