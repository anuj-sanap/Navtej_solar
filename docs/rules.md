# Navtej Solar Tech Energy — Development Rules

## 1. Before Coding
- Inspect the existing codebase before replacing architecture or dependencies.
- Understand the current calculator, graph and pincode functionality before modifying it.
- Confirm assumptions when requirements are ambiguous.
- Prefer extending existing working functionality over unnecessary rewrites.

## 2. Code Quality
- Use clear, descriptive names.
- Keep components focused.
- Avoid large monolithic files.
- Extract reusable logic when it is used more than once.
- Do not leave dead code or commented-out production code.
- Avoid `any` and weak typing when a stronger type/schema is available.

## 3. Frontend Rules
- Build mobile-first.
- Use reusable UI components.
- Maintain consistent spacing, typography and interaction patterns.
- Include loading, empty, success and error states.
- Do not use placeholder content in production without explicit approval.
- Keep animations purposeful and lightweight.

## 4. Backend Rules
- Never trust client input.
- Validate every write request server-side.
- Centralize database access.
- Return consistent error responses.
- Protect admin routes at both UI and API layers.
- Never expose passwords, secrets or internal configuration.

## 5. Database Rules
- Define schemas/models explicitly.
- Add timestamps to mutable business entities.
- Use indexes for frequent filters/searches.
- Store only data necessary for the application.
- Do not delete leads/projects accidentally; require explicit destructive actions.

## 6. Calculator Rules
- Calculation formulas belong in dedicated modules.
- Inputs and units must be explicit.
- Handle zero, empty, negative and extreme values.
- Round only for display unless the formula requires otherwise.
- Every formula change requires test cases.
- Graph values must come from the same calculation result used for displayed totals.

## 7. Form Rules
- Validate on the client for usability and on the server for security.
- Show specific, understandable validation messages.
- Prevent duplicate submission while a request is pending.
- Show success/failure feedback.
- Do not silently discard user input.

## 8. Git and Change Rules
- Make small, logically grouped changes.
- Use meaningful commit messages.
- Do not commit `.env` or credentials.
- Avoid unrelated refactors during a feature task.
- Preserve a working state after each phase.

## 9. Testing Rule
For every significant feature:
1. Test the happy path.
2. Test invalid input.
3. Test loading/failure behavior.
4. Test mobile responsiveness.
5. Test authorization where applicable.

## 10. Definition of Done
A task is done only when:
- Requirements are implemented.
- Relevant edge cases are handled.
- No known regression is introduced.
- The feature is manually tested.
- The code is readable and maintainable.
