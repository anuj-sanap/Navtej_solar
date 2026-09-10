# Navtej Solar Tech Energy — Project Memory

This file is the persistent working context for developers and AI coding assistants. Update it whenever a confirmed decision changes.

## 1. Project Identity
- Project: Navtej Solar Tech Energy website and management platform.
- Primary purpose: present solar solutions, generate leads and support internal lead/project management.
- Primary audience: prospective solar customers and authorized company administrators.

## 2. Confirmed Requirements
- Responsive public website.
- Solar calculator with graphs and calculation functionality.
- Pincode/location-related functionality where required.
- Contact/enquiry capture.
- WhatsApp/contact integration.
- MongoDB-backed data storage.
- Authentication and admin area.
- Enquiry management.
- Project management and image handling.
- Deployment support.
- Basic SEO.

## 3. Existing-System Constraint
The project may reuse or replicate behavior from the user's existing uploaded website/project. Existing working functionality should be inspected before replacement, especially:
- Calculator behavior.
- Graph generation.
- Pincode handling.
- Existing module structure.

Do not assume a rewrite is required.

## 4. Scope Decisions
Included:
- Marketing website.
- Calculator.
- Lead capture.
- Admin management for approved entities.

Not automatically included:
- Payments.
- Full CRM.
- Customer portal.
- Native mobile apps.
- Advanced third-party integrations.

## 5. Technical Decisions
Current recommended architecture:
- Component-based frontend.
- Server/API layer.
- MongoDB.
- Modular calculation engine.
- Protected admin routes.
- Environment-based configuration.

Final framework/library choices must match the existing codebase and deployment constraints where possible.

## 6. Business Data Still Needed
Before production launch, confirm:
- Official logo and brand assets.
- Company address and map location.
- Official phone/WhatsApp number.
- Official email.
- Services and service descriptions.
- Project portfolio images/details.
- Testimonials/certifications.
- Final calculator formulas and assumptions.
- Domain/hosting access.

## 7. Open Decisions
- Exact technology stack based on existing codebase.
- Admin roles: single admin or multiple roles.
- Image storage provider.
- Exact calculator inputs and formulas.
- Whether pincode data comes from an API, static dataset or another source.
- Whether enquiry export is required.

## 8. Working Protocol
When beginning a new task:
1. Read `prd.md`.
2. Read `architecture.md`.
3. Read `rules.md`.
4. Check `phases.md` for the current phase.
5. Read this file for confirmed decisions and unresolved questions.
6. Update this file after any significant approved decision.

## 9. Change Log
### 2026-09-05
- Initial project documentation created.
- Scope based on the previously discussed Navtej Solar Tech Energy website project.
- Existing calculator/graph/pincode functionality identified as behavior that should be preserved or deliberately reimplemented after inspection.
