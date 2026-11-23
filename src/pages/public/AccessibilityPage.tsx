import { PageHeader } from "@/components/shared/primitives";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";

export function AccessibilityPage() {
  usePageMeta("Accessibility statement", "Cultgig's commitment to an accessible marketplace.");
  return (
    <main id="main-content" className="page-container max-w-3xl space-y-6 py-10">
      <PageHeader title="Accessibility statement" description="We want every artist and every client to be able to use Cultgig." />
      <section className="space-y-3 type-body text-ink-secondary">
        <h2 className="type-h3 text-ink">Our target</h2>
        <p>Cultgig aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>
        <h2 className="type-h3 text-ink">What we do</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Semantic headings, landmarks and a “Skip to main content” link on every page.</li>
          <li>Every control works with a keyboard and shows a visible focus outline.</li>
          <li>Dialogs, menus and tabs follow WAI-ARIA patterns and keep focus where you expect.</li>
          <li>Status is never shown by colour alone: badges always include text and an icon.</li>
          <li>Text and interface colours are chosen to meet contrast requirements.</li>
          <li>Animations are reduced when your device asks for reduced motion.</li>
          <li>Form errors are announced to screen readers and explained in plain language.</li>
        </ul>
        <h2 className="type-h3 text-ink">Known limitations</h2>
        <p>Portfolio audio and video are hosted by artists on third-party sites, which may not provide captions or transcripts. We encourage artists to add descriptive captions.</p>
        <h2 className="type-h3 text-ink">Feedback</h2>
        <p>
          If something on Cultgig is hard to use, please <Link to="/support" className="text-brand">contact support</Link> and tell us the page and the assistive technology you use.
        </p>
      </section>
    </main>
  );
}
