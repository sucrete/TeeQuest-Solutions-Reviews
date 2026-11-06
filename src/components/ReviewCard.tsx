import { formatDate, type Review } from "@/lib/reviews";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 leading-7 text-neutral-700">{children}</dd>
    </div>
  );
}

export function ReviewCard({ review: r }: { review: Review }) {
  const role = [r.reviewer.title, r.reviewer.industry].filter(Boolean).join(", ");

  return (
    <article className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p aria-label={`Rated ${r.rating} out of 5`}>
          <span aria-hidden="true">
            {"★".repeat(r.rating)}
            <span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span>
          </span>{" "}
          <span className="font-medium">{r.rating.toFixed(1)}</span>
        </p>
        <time dateTime={r.date} className="text-neutral-500">
          {formatDate(r.date)}
        </time>
      </div>

      <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
      {r.review && <p className="mt-2 leading-7 text-neutral-700">{r.review}</p>}

      <dl className="mt-4 space-y-4">
        {r.pros && <Field label="Pros">{r.pros}</Field>}
        {r.cons && <Field label="Cons">{r.cons}</Field>}
        {r.reason_for_choosing && (
          <Field label="Why they chose TeeQuest">{r.reason_for_choosing}</Field>
        )}
        {r.switched_from && (
          <Field label={`Switched from ${r.switched_from.product}`}>
            {r.switched_from.reason}
          </Field>
        )}
        {r.alternatives_considered.length > 0 && (
          <Field label="Also considered">
            {r.alternatives_considered.join(", ")}
          </Field>
        )}
      </dl>

      {r.vendor_response && (
        <div className="mt-4 rounded-xl bg-neutral-100 p-4 text-sm">
          <p className="font-medium">
            Response from TeeQuest Solutions,{" "}
            <time dateTime={r.vendor_response.date}>
              {formatDate(r.vendor_response.date)}
            </time>
          </p>
          <p className="mt-1 leading-6 text-neutral-700">{r.vendor_response.text}</p>
        </div>
      )}

      {/* mt-auto pins the reviewer to the bottom so cards in a row line up. */}
      <div className="mt-auto pt-6">
        <footer className="border-t border-neutral-200 pt-4 text-sm">
          <p className="font-medium">{r.reviewer.name}</p>
          {role && <p className="text-neutral-600">{role}</p>}
          {r.reviewer.used_software_for && (
            <p className="text-neutral-500">
              Used TeeQuest for {r.reviewer.used_software_for.toLowerCase()}
            </p>
          )}
        </footer>
      </div>
    </article>
  );
}
