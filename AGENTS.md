## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project rules (Just Fire Doors SW)

- The approved build plan is `docs/architecture-plan.md`. Follow its implementation sequence (section C).
- The Claude Design prototype is the visual reference. Preserve its design; flag any visible change rather than making it silently.
- Never invent business facts, accreditations, reviews, service areas, dates or people. Unconfirmed facts stay `null` in `src/data/business.ts` and are tracked in `CONTENT-TODO.md`.
- No client-side framework and no runtime browser dependencies. JavaScript is progressive enhancement only.
- No trackers until the analytics decision is approved.
