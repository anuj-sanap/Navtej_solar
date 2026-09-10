# Navtej Solar Tech Energy — Technology Stack

## 1. Purpose

This document defines the recommended production technology stack for the Navtej Solar Tech Energy website.

The project is a real client-facing application and must support:

- Public marketing website
- Responsive design
- Solar calculator
- Graphs and calculation results
- Pincode/location functionality
- Contact and enquiry forms
- Admin authentication
- Admin dashboard
- Enquiry management
- Project management
- Image/media uploads
- SEO
- Production deployment

The stack should remain simple, maintainable, secure, cost-conscious and suitable for long-term client ownership.

---

# 2. Approved Core Stack

## Application Framework

**Next.js with TypeScript**

Next.js will be used for:

- Public website pages
- Server-side rendering where beneficial
- SEO-friendly pages
- API/Route Handlers
- Admin dashboard
- Server-side operations

TypeScript is required for application code where supported.

---

## Frontend

**React**

Used through Next.js for:

- Reusable components
- Interactive calculator
- Forms
- Admin interface
- Dynamic charts

---

## Styling

**Tailwind CSS**

Used for:

- Responsive layouts
- Consistent spacing
- Typography
- Component styling
- Design tokens
- Fast and maintainable UI development

A lightweight component approach may be used. Avoid adding a large UI framework unless there is a clear requirement.

Optional reusable components can use shadcn/ui where it reduces development time without introducing unnecessary complexity.

---

# 3. Backend and Database Platform

## Supabase

Supabase is the primary backend platform.

It will provide:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security where applicable

Do not use MongoDB or Mongoose unless the project requirements change significantly.

---

## Database

**Supabase PostgreSQL**

Primary structured data will include:

### Profiles / Admin Roles

Suggested fields:

```text
id
name
role
created_at
updated_at
```

Authentication identity should be managed through Supabase Auth rather than storing plaintext credentials in an application table.

### Enquiries

```text
id
name
phone
email
pincode
location
service_interest
message
calculator_data
source
status
created_at
updated_at
```

### Projects

```text
id
title
slug
category
location
description
featured
created_at
updated_at
```

Project images should be stored in Supabase Storage, with database records storing the appropriate paths or references.

---

# 4. Authentication

## Supabase Auth

Supabase Auth will manage authentication for the admin system.

Phase requirements:

- Secure admin login
- Authenticated sessions
- Protected admin pages
- Protected server operations
- Logout
- Support for future roles if required

Do not:

- Store plaintext passwords
- Implement custom insecure authentication
- Rely only on frontend route hiding

Authorization must also be enforced for protected server/database operations.

---

# 5. Authorization and Security

Use Supabase Row Level Security (RLS) where appropriate.

General approach:

```text
Public User
    |
    +-- Can access approved public data
    +-- Can submit approved enquiry data
    |
Admin User
    |
    +-- Can manage enquiries
    +-- Can manage projects
    +-- Can access protected admin operations
```

Security rules must be designed before exposing database tables directly to the client.

Sensitive operations should use server-side handling when appropriate.

Never expose:

- Service role keys
- Database credentials
- Secret environment variables

---

# 6. Image and Media Storage

## Supabase Storage

Use Supabase Storage for:

- Project images
- Gallery images
- Other approved website media

Recommended storage organization:

```text
projects/
  project-id/
    image-1.webp
    image-2.webp

company/
  branding/

uploads/
```

Requirements:

- Restrict allowed file types
- Restrict file sizes
- Validate uploads
- Use appropriate access policies
- Optimize images before or during delivery where practical

Do not store large image binaries directly inside PostgreSQL tables.

---

# 7. Forms

## React Hook Form

Use React Hook Form for:

- Contact forms
- Enquiry forms
- Calculator inputs where appropriate
- Admin forms

Benefits:

- Controlled form handling
- Better validation integration
- Reduced unnecessary rendering
- Reusable form patterns

---

# 8. Validation

## Zod

Use Zod to define validation schemas.

Validation must occur:

```text
User Input
    ↓
Client Validation
    ↓
Server Validation
    ↓
Database Operation
```

Important:

Client-side validation improves user experience.

Server-side validation is required for security.

Potential schemas:

- EnquirySchema
- CalculatorInputSchema
- AdminProjectSchema
- LoginSchema

Do not trust browser input.

---

# 9. Solar Calculator Architecture

The calculator is a core functional feature.

Use the following architecture:

```text
Calculator UI
      ↓
Input Validation
      ↓
Calculation Engine
      ↓
Standardized Result Object
      ↓
Result Cards
      +
Charts
      +
Recommendations
```

Calculation logic must be separated from UI components.

Recommended conceptual structure:

```text
features/
  calculator/
    components/
    schemas/
    calculations/
      calculateSolarSystem.ts
      calculateSavings.ts
      calculateGeneration.ts
    types/
```

Rules:

- Do not duplicate formulas across components.
- Keep units explicit.
- Handle invalid and extreme inputs.
- Test important calculations.
- Charts must use the same standardized result object as displayed values.

---

# 10. Charts and Graphs

## Recharts

Use Recharts for calculator visualizations such as:

- Monthly savings
- Estimated generation
- Cost comparison
- Payback visualization
- Other approved calculator insights

Charts must be:

- Responsive
- Understandable
- Accessible where practical
- Based on real calculation output

Do not add charts only for decoration.

---

# 11. Pincode and Location Functionality

Pincode functionality must be isolated behind a service layer.

Recommended structure:

```text
services/
  location/
    pincode.service.ts
```

or the equivalent structure appropriate for the final codebase.

Architecture:

```text
Pincode Input
      ↓
Validation
      ↓
Location Service
      ↓
External API / Approved Data Source
      ↓
Standardized Location Result
```

This prevents the UI from becoming dependent on a specific external API.

If the data source changes later, only the service implementation should require major modification.

---

# 12. API and Server Operations

Use Next.js server capabilities for backend operations.

Use:

- Route Handlers
- Server-side functions
- Server Actions only where appropriate for the application architecture

Keep API/business logic separate from presentation components.

Typical operations:

```text
POST /api/enquiries
GET /api/admin/enquiries
PATCH /api/admin/enquiries/:id

GET /api/projects
POST /api/admin/projects
PATCH /api/admin/projects/:id
DELETE /api/admin/projects/:id
```

The exact implementation may evolve according to the final application architecture.

All protected operations require authentication and authorization.

---

# 13. Hosting and Deployment

## Vercel

Use Vercel for hosting the Next.js application.

Deployment environments:

```text
Development
      ↓
Preview / Testing
      ↓
Production
```

Requirements:

- Production environment variables configured securely
- Separate production configuration
- Production build tested before release
- Custom domain connected for the client
- HTTPS enabled

---

# 14. Version Control

## Git + GitHub

Use Git for version control and GitHub for repository hosting.

Recommended workflow:

```text
main
  ↓
production-ready code

feature branches
  ↓
new functionality
```

Requirements:

- Meaningful commit messages
- `.env` excluded from Git
- `.env.example` included
- Avoid committing generated secrets or credentials

---

# 15. Recommended Final Stack

```text
Frontend / Full Stack
└── Next.js + TypeScript

UI / Styling
└── Tailwind CSS

Backend Platform
└── Supabase

Database
└── PostgreSQL via Supabase

Authentication
└── Supabase Auth

Authorization
└── Supabase RLS + server-side checks

File Storage
└── Supabase Storage

Forms
└── React Hook Form

Validation
└── Zod

Charts
└── Recharts

Hosting
└── Vercel

Version Control
└── Git + GitHub
```

---

# 16. High-Level Production Architecture

```text
                         USERS
                           |
                           v
                  NAVTEJ SOLAR WEBSITE
                           |
                           v
                    Next.js Application
                    /                 \
                   /                   \
          Public Website           Admin Dashboard
                   \                   /
                    \                 /
                     v               v
                  Server / API Layer
                           |
              +------------+------------+
              |                         |
              v                         v
       Supabase PostgreSQL       Supabase Auth
              |
              v
          Supabase Storage
              |
              v
       Project / Gallery Images

                           |
                           v
                         Vercel
                    Production Hosting
```

---

# 17. Client Ownership and Production Handover

For a real client project, production services should preferably be owned by the client.

Recommended ownership:

```text
Domain
→ Client account

Supabase Project
→ Client account or organization

Vercel Project
→ Client account or organization

GitHub Repository
→ Client organization or transferred at handover
```

The developer can receive appropriate collaborator access.

Do not make the client's production website permanently dependent on the developer's personal accounts.

---

# 18. Cost and Complexity Rules

This project has a limited budget and should avoid unnecessary infrastructure.

Do NOT introduce the following unless there is a real requirement:

- Separate Express backend
- MongoDB in addition to Supabase
- Mongoose
- Microservices
- Docker/Kubernetes for this project
- Redis
- Message queues
- Redux for simple application state
- Complex CMS
- Multiple cloud providers

Prefer the simplest production-ready solution.

---

# 19. Environment Variables

The exact variable names may depend on the implementation, but the application will generally require:

```env
NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- Public values may only be exposed when intended for browser usage.
- Server-only secrets must never be sent to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- Never commit real `.env` files.
- Maintain an `.env.example` file without real credentials.

---

# 20. Required Supabase Architecture

The implementation should maintain clear separation between:

```text
Supabase Client
    ↓
Data Access / Service Layer
    ↓
Application Features
    ↓
UI Components
```

Do not scatter raw database queries throughout UI components.

Create reusable access patterns appropriate to the final Next.js architecture.

---

# 21. Technology Decisions

These are the current project technology decisions:

| Area | Decision |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend Platform | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Hosting | Vercel |
| Version Control | Git + GitHub |

This stack should be treated as the default implementation stack unless a future project requirement provides a strong reason to change it.

---

# 22. Integration with Other Project Documents

This file must be considered together with:

```text
prd.md
architecture.md
rules.md
phases.md
design.md
memory.md
```

When there is a technology-related change:

1. Update `tech.md`.
2. Update `architecture.md` if the system architecture changes.
3. Update `memory.md` with the confirmed decision.
4. Ensure the change does not conflict with `prd.md`.
5. Do not introduce unnecessary technology changes mid-project.

---

# 23. Final Principle

The technology stack must support a reliable production website without unnecessary complexity.

The guiding principle is:

```text
Simple
+
Secure
+
Maintainable
+
Production-ready
+
Client-owned
```

The goal is not to use the maximum number of technologies.

The goal is to use the smallest practical set of standard tools required to build and maintain a professional Navtej Solar Tech Energy website.
