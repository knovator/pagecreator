# PageCreator - Project Guide

## Project Overview
PageCreator is an NX monorepo CMS library for creating widget-based pages. It provides admin UI, user-facing rendering components, and a backend with models/controllers/routes.

## Architecture

### Monorepo Structure
```
pagecreator/
├── apps/
│   ├── api/              # Express backend (demo server)
│   ├── pagecreator/      # Admin UI app (React/Vite)
│   ├── front/            # Public frontend (Next.js)
├── libs/
│   ├── admin/            # Admin UI library (components, contexts, forms)
│   ├── user/             # User library (widget rendering components)
│   └── node/             # Backend library (models, services, controllers, routes)
```

### Tech Stack
- **Backend**: Express, MongoDB (Mongoose), Redis (caching)
- **Admin**: React 18, React Hook Form, React Beautiful DnD, React Select
- **User**: React 18, Swiper (carousel), React Tabs
- **Build**: NX, TypeScript

### Library Exports
- `@nichekit/node` → Backend models, routes, controllers
- `@nichekit/admin` → Admin UI components (Widget, Page, Provider)
- `@nichekit/user` → User components (Widget, Page, getData)

## Data Model
- **Page**: name, code, slug, widgets[] (Widget refs)
- **Widget**: name, code, widgetType, itemsType, items, tabs, collectionItems, layout config
- **Item**: title, subtitle, altText, link, img, srcset, itemType (Web/Mobile)
- **Tab**: name, widgetId, collectionItems[]
- **SrcSet**: width, height, screenSize, itemId

### Widget Types: FixedCard, Carousel, Tabs, Text, HTML
### Item Types: Image (built-in), plus external collections via setConfig()

## Key Patterns
- Config via `setConfig()`: collections, customWidgetTypes, languages, redis
- Redis caching: `widgetData_${code}`, `pageData_${code}`
- Admin state: React Context (WidgetContext, PageContext, ProviderContext)
- User lib: Props-based with callbacks (formatItem, onClick, formatHeader, formatFooter)
- CSS prefixes: `khb_` (admin), `kpc_` (user)
- Soft delete, unique code validation, multi-language support

## Key Files
| Area | Path |
|------|------|
| Enums | `libs/node/src/types/enums.ts` |
| Types | `libs/node/src/types/common.ts` |
| Widget Model | `libs/node/src/models/Widget.ts` |
| Widget Controller | `libs/node/src/controllers/WidgetController.ts` |
| Data Service | `libs/node/src/services/dataService.ts` |
| Widget Form (Admin) | `libs/admin/src/lib/components/Widget/Form/WidgetForm.tsx` |
| Widget Context | `libs/admin/src/lib/context/WidgetContext.tsx` |
| Widget Router (User) | `libs/user/src/lib/components/widget/widget.tsx` |
| Page Component | `libs/user/src/lib/components/page/page.tsx` |
| User Types | `libs/user/src/lib/types/api.ts` |

## Build Commands
```bash
npx nx build node        # Backend library
npx nx build admin       # Admin library
npx nx build user        # User library
npx nx serve api         # API server
npx nx serve pagecreator # Admin app
```
