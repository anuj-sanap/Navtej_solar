# Navtej Solar Tech Energy — Product Requirements Document

## 1. Product Overview
Navtej Solar Tech Energy requires a professional, responsive, lead-generation website for showcasing solar energy solutions and converting visitors into qualified enquiries. The platform will also provide a solar savings/calculator experience and an internal admin area for managing website content and customer leads.

## 2. Goals
- Establish a credible online presence.
- Explain residential, commercial and industrial solar solutions.
- Generate and store qualified leads.
- Provide an interactive solar calculator with visual results.
- Support location/pincode-based inputs where required.
- Allow administrators to manage enquiries, projects and relevant website content.
- Deliver a fast, mobile-first experience.

## 3. Target Users
### Prospective customers
Homeowners, businesses and organizations exploring solar installation.

### Administrators
Navtej Solar Tech Energy staff who manage leads, projects, content and website data.

## 4. Core User Journeys
1. Visitor lands on the homepage.
2. Visitor understands services and credibility through projects/testimonials/content.
3. Visitor uses the solar calculator or browses services.
4. Visitor submits an enquiry or contacts the company through WhatsApp/phone.
5. Enquiry is stored in the database.
6. Admin reviews, updates and manages the enquiry.

## 5. Functional Requirements

### Public Website
- Home page with strong CTA.
- About/company information.
- Services/solutions pages.
- Projects/gallery or case studies.
- Solar calculator.
- Contact/enquiry page.
- Responsive navigation and footer.
- WhatsApp and click-to-call actions.
- Google Maps/location integration if business details are provided.
- Basic SEO metadata and share previews.

### Solar Calculator
The calculator should:
- Accept required consumption, location/pincode and/or system inputs.
- Validate user input.
- Calculate estimated solar requirements/savings using approved formulas.
- Display results clearly.
- Render graphs/charts where they improve understanding.
- Clearly label estimates and assumptions.
- Keep calculation logic modular and testable.

### Lead/Enquiry Management
Capture, at minimum where applicable:
- Name
- Phone number
- Email
- Location/pincode
- Service interest
- Consumption or calculator context
- Message
- Lead source
- Submission timestamp
- Status

Admin capabilities:
- Secure login.
- View enquiry list and details.
- Search/filter enquiries.
- Update lead status.
- Export only if included in final scope.
- Protect sensitive data from unauthorized access.

### Project Management
- Add/edit/delete projects.
- Upload/manage project images.
- Store title, location, category, description and other approved metadata.
- Display selected projects on the public site.

## 6. Non-Functional Requirements
- Mobile-first responsive design.
- Good Core Web Vitals where practical.
- Secure server-side validation.
- Accessible semantic structure and keyboard-friendly UI.
- Graceful loading/error/empty states.
- No secrets committed to source control.
- Maintainable, modular code.

## 7. Success Metrics
- Enquiry submission conversion.
- Calculator completion rate.
- Mobile usability.
- Page load performance.
- Admin ability to process leads efficiently.

## 8. Out of Scope Unless Explicitly Approved
- Online payment/e-commerce.
- Full CRM replacement.
- Complex customer portal.
- Real-time installation monitoring.
- Native mobile application.
- Advanced ERP/accounting integration.

## 9. Acceptance Criteria
The project is complete when:
- All approved public pages work on mobile and desktop.
- Calculator calculations and graphs match approved test cases.
- Valid enquiries are stored and visible to authorized admins.
- Admin CRUD operations work for approved entities.
- Forms have validation and useful error states.
- Core flows are tested.
- Production configuration uses environment variables and does not expose secrets.
