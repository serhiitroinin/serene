import { createFileRoute } from "@tanstack/react-router";
import { VariantSwitcher } from "~/components/variant-switcher";
import { variants, variantOrder, type VariantKey } from "~/variants";

const isVariantKey = (value: unknown): value is VariantKey =>
  typeof value === "string" && (variantOrder as ReadonlyArray<string>).includes(value);

type Search = { v: VariantKey };

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search: Record<string, unknown>): Search => ({
    v: isVariantKey(search.v) ? search.v : "terminal",
  }),
});

function Home() {
  const { v } = Route.useSearch();
  const Variant = variants[v];
  return (
    <>
      <Variant />
      <VariantSwitcher current={v} />
    </>
  );
}
