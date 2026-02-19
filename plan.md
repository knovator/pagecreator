# Keyword-Based Landing Pages — Implementation Plan

## Goal
Enable admins to create SEO-focused landing pages by configuring Browse Jobs filters in the page builder, persist those filters as page metadata, and auto-apply them on page load. Feature is available for Growth/Scale plans, with Starter seeing an upgrade CTA.

## Scope
- Page builder: browse jobs widget filter configuration UI.
- Backend: store filter metadata with page data and return it in page payload.
- Frontend: apply saved filters when rendering Browse Jobs widget.
- Analytics: PostHog events for widget and filter usage.
- Plan gating: Growth/Scale create; Starter view + upgrade CTA.

## Data Model (Page Metadata)
Store filter metadata on the page document and return it in page data.

Proposed shape:
```json
{
  "filters": {
    "browse_jobs": {
      "widgetId": "string",
      "keyword": ["string"],
      "category": ["string"],
      "country": ["string"],
      "city": ["string"],
      "companies": ["string"],
      "jobPreferences": ["string"],
      "jobExperience": ["string"],
      "employmentType": ["string"]
    }
  }
}
```

Notes:
- Use arrays for multi-select fields.
- Maintain mapping from widgetId to filter config to support multiple widgets if needed.
- Store empty arrays when filters are not set.

## Backend Changes
1) Page schema + validation
   - Add `filters` to `Page` model.
   - Update validation for page create/update to allow `filters` payload.
2) Page data assembly
   - Include `filters` in page payload from the page aggregate.
3) Redis invalidation
   - Ensure page cache invalidates when filters are updated.

## Admin UI (Page Builder)
1) Widget selection
   - Detect "Browse Jobs" widget (by code/type) and show a settings icon.
2) Configure Filters modal
   - Title: "Configure Filters"
   - Multi-select inputs:
     - Keyword, Category, Country, City, Companies, Job Preferences,
       Job Experience, Employment Type
   - Show job count with applied filters and "No jobs found" when zero.
3) Save behavior
   - Save filters into page `filters` metadata on page create/update.
   - Show selected filters summary on the widget row (Browse Jobs (x)).
   - Provide Clear All action.
4) Plan gating
   - Starter: show feature but disable apply/save and show Upgrade CTA.
   - Growth/Scale: full access.

## Frontend (Public Page Rendering)
1) Page load
   - Fetch page by slug and read stored filters.
   - Pass filters to Browse Jobs widget as query params or props.
2) Widget behavior
   - Filtered jobs only.
   - Preset filters are primary unless user clears them.
   - If no jobs match: show "No jobs found".
3) Edge behaviors
   - If referenced filter master data is deleted: zero jobs shown.
   - If page is deleted: redirect user to Browse Jobs page.

## SEO Requirements
- Unique static URL per page.
- Slug should include target keyword.
- Default image/title used for sharing when custom values are not set.

## Rollout/Testing
1) Unit tests
   - Page create/update validation with filters.
2) Integration tests
   - Create page with filters, fetch page, verify filters returned and applied.
3) UI checks
   - Modal rendering, filter selection, job count, and zero-job state.
4) Manual QA
   - Growth/Scale vs Starter gating.

## Assumptions / Open Questions
- How the Browse Jobs widget is identified (code/type).
- API endpoint for fetching filter options + job count.
- Exact fields used for filters in the jobs system.
