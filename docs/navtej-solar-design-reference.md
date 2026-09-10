# Navtej Solar Tech Energy — Visual Design Reference & UI Specification

## 1. Primary Design Reference

The primary visual reference for the public website is:

Solar Energy – Website Design UI/UX by Sahin Mia / Pixelean on Dribbble.

Reference:
https://dribbble.com/shots/26967852-Solar-Energy-Website-Design-UI-UX

The Navtej Solar Tech Energy website should take inspiration from the **visual language, hierarchy, composition and overall experience** of this reference.

This is an inspiration and direction document, not an instruction to copy copyrighted artwork, logos, text, photographs or exact assets.

The final implementation must use Navtej Solar Tech Energy branding, original content, original/reusable assets and the actual functionality defined in `prd.md`.

---

# 2. Design Goal

Create a premium, modern and trustworthy solar-energy website that feels:

- Clean
- Bright
- Professional
- Premium
- Friendly
- Technically credible
- Easy to understand
- Conversion-focused

The reference demonstrates a well-organized solar business experience focused on solar solutions, services, projects, savings and trust. The Navtej website should achieve the same level of clarity while being customized for its own brand and requirements.

---

# 3. Visual Direction

## Overall Composition

Use a spacious, editorial layout with:

- Large content sections
- Clear visual hierarchy
- Strong hero composition
- Generous whitespace
- Rounded cards and panels where appropriate
- Large, readable headings
- Clean image placement
- Structured content grids
- Clear separation between informational and conversion sections

Avoid making the website look like a generic template.

## Color Direction

The Dribbble reference uses a light, cool palette with dark typography and muted blue accents. Use this as inspiration for contrast and balance.

The final Navtej Solar Tech Energy palette should be based on approved brand assets.

Until final brand colors are confirmed, establish semantic design tokens rather than scattering raw colors throughout the codebase:

```text
--background
--surface
--surface-muted
--text-primary
--text-secondary
--border
--brand-primary
--brand-secondary
--accent
--success
--warning
--error
```

Do not copy the reference palette blindly if it conflicts with Navtej branding.

## Typography

Typography should be bold and highly readable.

Recommended hierarchy:

- Display / Hero: strong, large, confident
- H1: primary page message
- H2: major section message
- H3: card or subsection heading
- Body: readable and relaxed
- Small text: only for supporting information

Avoid:
- Thin, low-contrast body text
- Too many font families
- Random font sizes
- Decorative typography that harms readability

Use one primary font family unless there is a documented reason for another.

---

# 4. Public Website Design Structure

The public site should follow a polished story-driven flow.

## Header

Design a clean top navigation containing:

- Navtej Solar Tech Energy logo
- Primary navigation
- Desktop CTA
- Responsive mobile menu

Suggested navigation:

```text
Home
About Us
Solar Solutions / Services
Projects
Solar Calculator
Contact
```

Primary CTA examples:

```text
Get a Free Consultation
Calculate Your Savings
Request a Quote
```

The header should:
- Remain uncluttered
- Have clear active states
- Work smoothly on mobile
- Not occupy excessive vertical space

---

# 5. Homepage

The homepage should be the primary conversion and storytelling page.

Recommended flow:

```text
Header
  ↓
Hero
  ↓
Trust / Key Metrics
  ↓
Services / Solar Solutions
  ↓
Why Choose Us
  ↓
How It Works
  ↓
Featured Projects
  ↓
Solar Savings / Calculator Preview
  ↓
Testimonials / Trust
  ↓
Final CTA
  ↓
Footer
```

## Hero Section

The hero should be visually strong and immediately communicate:

1. What Navtej Solar Tech Energy provides.
2. Why solar is valuable.
3. What action the visitor should take.

Recommended composition:

```text
------------------------------------------------
| Main Headline             | Visual / Image    |
| Supporting Description    | Solar Context     |
| Primary CTA               |                   |
| Secondary CTA             |                   |
------------------------------------------------
```

Use:
- Large headline
- Short supporting copy
- One strong primary CTA
- Optional secondary action
- High-quality solar/project imagery or custom visual

Do not overload the hero with paragraphs or too many buttons.

---

# 6. Trust and Metrics Section

Directly after the hero, provide quick credibility indicators.

Examples:

- Years of experience
- Installations completed
- MW/kW capacity installed
- Happy customers
- Energy saved
- Geographic coverage

Use visually clear metric cards or inline statistics.

Numbers must come from verified company information. Do not invent achievements.

---

# 7. Services / Solar Solutions

Use modern service cards inspired by the reference's clean modular layout.

Potential categories:

- Residential Solar
- Commercial Solar
- Industrial Solar
- Rooftop Solar
- Solar Consultation
- Installation and Maintenance

Each card should contain:

```text
Icon or Visual
Service Name
Short Description
Key Benefit
Learn More →
```

Cards should:
- Have consistent dimensions where possible
- Use subtle interaction feedback
- Remain easy to scan
- Stack gracefully on mobile

Avoid excessive text inside cards.

---

# 8. Why Choose Navtej

Create a section explaining the company's differentiation.

Use a combination of:

- Strong section headline
- Short explanation
- Benefits grid
- Supporting imagery or visual composition

Potential benefits:

- Expert consultation
- Quality installation
- Customized solutions
- Energy savings
- Ongoing support

Final benefits must match actual company capabilities.

---

# 9. How the Solar Process Works

Create a simple visual journey.

Suggested process:

```text
01
Consultation
      ↓
02
Site Assessment
      ↓
03
System Design
      ↓
04
Installation
      ↓
05
Energy Generation / Support
```

Desktop can use a horizontal process.

Mobile should use a vertical or stacked flow.

The process must be easy to understand at a glance.

---

# 10. Projects / Portfolio

The projects section should be image-led and premium.

Each project card may include:

- Main image
- Project name
- Location
- System category
- Capacity
- Short description

Example layout:

```text
[ Large Featured Project ]
[ Project ] [ Project ]
[ Project ] [ Project ]
```

Use a featured project to create hierarchy rather than making every card identical.

Future project data should be manageable through the admin system defined in the PRD and architecture documents.

---

# 11. Solar Calculator Design

The calculator is a major functional component and should receive premium treatment.

The visual experience should be:

```text
Input
  ↓
Calculate
  ↓
Result Summary
  ↓
Savings / Recommendation
  ↓
Charts and Graphs
  ↓
CTA: Request Consultation
```

## Input Area

Inputs should be grouped logically.

Possible inputs may include:

- Monthly electricity bill
- Monthly units consumed
- Property type
- Pincode
- Location
- Available roof area

Actual inputs must follow the approved calculator logic.

## Results Area

Results should use clear visual hierarchy.

Possible result cards:

- Recommended system size
- Estimated generation
- Estimated savings
- Estimated payback period
- Environmental impact

Graphs should be clean and useful.

Do not create graphs only for decoration.

Critical rule:

**All displayed values and graph data must come from the same standardized calculation result.**

Do not duplicate formulas in the chart component.

## Calculator Conversion

After results, provide a contextual CTA:

```text
Get a Detailed Solar Proposal
Book a Free Consultation
Talk to a Solar Expert
```

If the user submits an enquiry after using the calculator, preserve relevant calculator context where approved by the product requirements.

---

# 12. Testimonials and Social Proof

Use a clean, credible layout.

Potential content:

- Client quote
- Name
- Location
- Project type
- Optional project image

Do not use fake testimonials as final production content.

If real testimonials are unavailable, the section can remain disabled until approved content is supplied.

---

# 13. Final CTA Section

The bottom CTA should be visually distinct.

Goal:

Convert a visitor who has completed the page journey.

Possible content:

```text
Ready to Start Saving with Solar?

Get a personalized solar solution for your home or business.

[ Get a Free Consultation ]
```

Keep the CTA simple and focused.

---

# 14. Footer

The footer should be structured and easy to navigate.

Include as applicable:

- Logo
- Company summary
- Navigation
- Services
- Contact details
- Address
- Social links
- Legal links
- Copyright

Actual contact and business information must come from confirmed project data.

---

# 15. Inner Page Design

All inner pages should maintain the same design system.

## About Page

Recommended flow:

```text
Page Hero
Company Introduction
Mission / Vision
Company Story
Why Choose Us
Achievements / Metrics
CTA
```

## Services Page

Recommended flow:

```text
Page Hero
Service Overview
Detailed Service Sections
Benefits
Process
FAQ if required
CTA
```

## Projects Page

Recommended flow:

```text
Page Hero
Filters if required
Featured Project
Project Grid
Project Details
CTA
```

## Contact Page

Recommended flow:

```text
Contact Hero
Contact Methods
Enquiry Form
Location / Map
Business Hours if applicable
CTA / WhatsApp
```

---

# 16. Card Design System

Cards should have a consistent language.

Possible card characteristics:

- Clear padding
- Comfortable spacing
- Rounded corners
- Subtle border or depth
- Strong title hierarchy
- Controlled hover interaction

Do not make every section look like a floating card.

Use cards where grouping improves comprehension.

---

# 17. Buttons and CTA Hierarchy

Define a clear hierarchy:

## Primary

Main conversion action.

Examples:

- Get a Free Quote
- Calculate Savings
- Contact Us

## Secondary

Supporting navigation or alternative action.

Examples:

- View Projects
- Learn More

## Tertiary / Text Action

Low-emphasis navigation.

Examples:

- View All Services →
- Explore Projects →

Do not place multiple competing primary CTAs next to each other without a clear reason.

---

# 18. Motion and Interaction

Use subtle, purposeful motion.

Suitable interactions:

- Card hover elevation or movement
- Button state feedback
- Mobile menu transition
- Section reveal only if performance remains good
- Calculator result transitions
- Image hover effects

Avoid:

- Heavy scroll animations
- Excessive parallax
- Long animations
- Constant moving backgrounds
- Animation that delays interaction

The website should feel polished, not distracting.

---

# 19. Responsive Requirements

The Dribbble shot is primarily a desktop design reference. The Navtej implementation must not simply shrink the desktop layout.

Design intentionally for:

## Mobile

- Single-column layouts
- Clear CTA placement
- Compact navigation
- Stacked cards
- Horizontal overflow prevention
- Touch-friendly controls

## Tablet

- Flexible grids
- Balanced content width
- Adapted spacing

## Desktop

- Strong visual composition
- Multi-column sections
- Editorial whitespace
- Large hero presentation

Test all major sections individually.

---

# 20. Accessibility

The visual design must not sacrifice usability.

Requirements:

- Semantic heading hierarchy
- Sufficient contrast
- Keyboard navigation
- Visible focus states
- Accessible form labels
- Meaningful alt text
- No color-only communication
- Respect reduced-motion preferences where applicable

---

# 21. Image and Asset Strategy

Use:

- Real Navtej projects where available
- Licensed or properly sourced solar imagery where required
- Optimized responsive images
- Correct aspect ratios
- Lazy loading where appropriate

Do not copy images from the Dribbble reference.

Use the reference only for inspiration regarding composition and visual direction.

---

# 22. Admin Dashboard Design

The Dribbble reference is for the public-facing marketing website.

Do NOT apply the same highly editorial marketing layout directly to the admin dashboard.

The admin interface should prioritize:

- Information density
- Clear navigation
- Tables and filters
- Status indicators
- Search
- Fast task completion
- Responsive usability

Maintain brand consistency, but optimize admin screens for productivity.

---

# 23. Implementation Rules

When implementing this design:

1. Read `prd.md`, `architecture.md`, `rules.md`, `phases.md`, and `memory.md`.
2. Treat this `design.md` as the primary visual specification.
3. Do not copy the Dribbble design pixel-for-pixel.
4. Do not copy its images, logo, text or proprietary assets.
5. Recreate the quality of hierarchy, spacing, composition and modern solar-industry presentation.
6. Preserve existing functional requirements.
7. Do not sacrifice calculator accuracy for visual design.
8. Build reusable components.
9. Use responsive, mobile-first implementation.
10. Avoid unnecessary animation and dependencies.
11. Test the design on mobile and desktop.
12. Use real Navtej content when available.
13. Clearly mark temporary placeholders.

---

# 24. AI / Developer Workflow for Design Tasks

Before implementing a page or component:

```text
Read project documentation
        ↓
Identify functional requirement
        ↓
Identify visual requirement from design.md
        ↓
Inspect existing implementation
        ↓
Reuse or improve existing components
        ↓
Implement responsive layout
        ↓
Test functionality
        ↓
Test mobile and desktop
        ↓
Update memory.md if a significant decision was made
```

When a visual requirement conflicts with usability, accessibility, performance or a functional requirement:

1. Preserve functionality.
2. Preserve accessibility.
3. Preserve responsive behavior.
4. Adapt the visual design rather than breaking the product.

---

# 25. Acceptance Criteria

The visual implementation is successful when:

- The website has a modern, premium solar-business appearance inspired by the reference.
- It has its own Navtej Solar Tech Energy identity.
- The hero has strong visual and conversion hierarchy.
- Services, projects, process and calculator are easy to understand.
- The design feels consistent across pages.
- Components use a coherent design system.
- Mobile layouts are intentionally designed.
- The calculator and charts remain usable and accurate.
- Forms remain clear and accessible.
- The website does not contain copied proprietary assets from the reference.
- The implementation follows `prd.md`, `architecture.md`, and `rules.md`.

---

# 26. Reference Summary

The target visual direction can be summarized as:

```text
Premium
+ Clean
+ Spacious
+ Modern
+ Trustworthy
+ Editorial
+ Solar-focused
+ Conversion-oriented
+ Data-friendly
+ Mobile-first
```

The objective is:

**Create a Navtej Solar Tech Energy website that delivers the same level of modern visual quality and clarity as the reference, while being an original implementation built around Navtej's actual services, projects, calculator functionality and business requirements.**
