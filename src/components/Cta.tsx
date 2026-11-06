import { site } from "@/lib/site";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        See TeeQuest at your course
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-neutral-600">
        Tee sheet, point of sale, online booking and reporting in one system.
      </p>
      <a
        href={site.demoUrl}
        className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Book a demo
      </a>
    </section>
  );
}
