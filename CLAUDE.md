# Project Guidelines

<!-- WEDNESDAY_SKILLS_START -->
## Wednesday Agent Skills

This project uses Wednesday Solutions agent skills for consistent code quality and design standards.

### Available Skills

<available_skills>
  <skill>
    <name>wednesday-design</name>
    <description>Design and UX guidelines for Wednesday Solutions projects. Covers visual design tokens, animation patterns, component standards, accessibility, and user experience best practices for React/Next.js applications. ENFORCES use of approved component libraries only.</description>
    <location>.wednesday/skills/wednesday-design/SKILL.md</location>
  </skill>
  <skill>
    <name>wednesday-dev</name>
    <description>Technical development guidelines for Wednesday Solutions projects. Enforces import ordering, complexity limits, naming conventions, TypeScript best practices, and code quality standards for React/Next.js applications.</description>
    <location>.wednesday/skills/wednesday-dev/SKILL.md</location>
  </skill>
</available_skills>

### How to Use Skills

When working on tasks, check if a relevant skill is available above. To activate a skill, read its SKILL.md file to load the full instructions.

For example:
- For code quality and development guidelines, read: .wednesday/skills/wednesday-dev/SKILL.md
- For design and UI component guidelines, read: .wednesday/skills/wednesday-design/SKILL.md

### Important

- The wednesday-design skill contains 492+ approved UI components. Always check the component library before creating custom components.
- The wednesday-dev skill enforces import ordering, complexity limits (max 8), and naming conventions.

<!-- WEDNESDAY_SKILLS_END -->

## Wednesday Solutions Standards (Auto-Enforced)

All code in this project MUST comply with the Wednesday agent skills at `.wednesday/skills/`.

### Before writing any code, read:
- `.wednesday/skills/wednesday-dev/SKILL.md` for technical standards
- `.wednesday/skills/wednesday-design/SKILL.md` for design standards

### On every code change:

1. **Imports** — Follow the ordering in wednesday-dev SKILL.md.
   > **VibeStream note**: This project's ESLint `import/order` rule enforces `next/image`
   > before `react`. Follow the ESLint config (which runs in CI) over the skill guideline.

2. **Naming** — PascalCase for components/types, camelCase for functions/variables,
   UPPER_SNAKE_CASE for module-level constants. No magic numbers/strings inline.

3. **Complexity** — Keep cyclomatic complexity ≤ 8. If a function exceeds this, extract
   helper functions or sub-components before merging.

4. **TypeScript** — Zero `any` types. All exported functions must have explicit return
   types. Use `unknown` + type narrowing instead of `any`.

5. **Components** — Check `.wednesday/skills/wednesday-design/references/COMPONENT-LIBRARY.md`
   before building custom UI. VibeStream's custom `components/ui/` components are already
   approved (built on Radix UI primitives); do not add new ones without justification.

6. **Design Tokens** — Never hardcode colors, spacing, font sizes, or shadows.
   Use the CSS custom properties defined in `styles/tailwind.css` (e.g. `var(--accent)`,
   `var(--bg-primary)`, `var(--text-secondary)`).

7. **Animations** — Only animate `transform` and `opacity`. Use `transition-[max-height]`
   when height transitions are required. Never use `transition-all` on layout properties.

8. **Accessibility** — All `role="button"` divs must handle both `Enter` and `Space`
   in `onKeyDown`. All interactive elements need `aria-label`. Images need descriptive
   `alt` text (empty string `alt=""` is acceptable for decorative artwork thumbnails).

9. **Tests** — Every new component, hook, or store must have a corresponding `.test.tsx`
   / `.test.ts` file. Test stubs with TODO comments are acceptable for initial coverage;
   complete the assertions before marking the feature done.