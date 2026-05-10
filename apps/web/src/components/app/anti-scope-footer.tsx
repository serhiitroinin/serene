// Visible site-wide. Enforces ADR-0002 (no treatment decision support).
// Wording is checked against /docs/anti-scope.md — keep verbatim or update both.
export function AntiScopeFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/50 px-6 py-4 text-xs text-muted-foreground/80 backdrop-blur-sm">
      <p className="mx-auto max-w-3xl text-center leading-relaxed">
        serene displays your data. <span className="font-medium">It is not a medical device.</span>{" "}
        Use the LibreLinkUp app for alarms; consult your endocrinologist for treatment decisions.{" "}
        <a
          href="https://github.com/serhiitroinin/serene/blob/main/docs/anti-scope.md"
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:underline"
        >
          What serene is and isn&apos;t
        </a>
        .
      </p>
    </footer>
  );
}
