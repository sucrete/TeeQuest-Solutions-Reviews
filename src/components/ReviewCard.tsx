import { FallbackAvatar } from "@/components/FallbackAvatar";
import { avatarColors } from "@/data/avatar-colors";
import { formatDate, reviewBody, type Review } from "@/lib/reviews";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-[#63e]">{label}</dt>
      <dd className="mt-1 leading-7 text-neutral-700">{children}</dd>
    </div>
  );
}

export function ReviewCard({ review: r }: { review: Review }) {
  const body = reviewBody(r);
  const role = [r.reviewer.title, r.reviewer.industry]
    .filter(Boolean)
    .join(", ");

  return (
    // on hover: a soft shadow (shadow-xl at 5% black) plus a faint 5px ring that grows out from
    // behind the card (ring-0 to ring-5; both are box-shadows, so
    // transition-shadow animates them together)
    <article className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 ring-0 ring-[#00000005] transition-shadow duration-300 ease-out hover:shadow-xl/5 hover:ring-5">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p aria-label={`Rated ${r.rating} out of 5`}>
          <span aria-hidden="true">
            <span className="text-[#ffcf02]">{"★".repeat(r.rating)}</span>
            <span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span>
          </span>{" "}
          <span className="font-medium">{r.rating.toFixed(1)}</span>
        </p>
        {/* Departure Mono, uppercase and 12px on desktop like all mono text */}
        <time
          dateTime={r.date}
          className="font-mono text-sm text-neutral-500 uppercase md:text-xs"
        >
          {formatDate(r.date)}
        </time>
      </div>

      <h3 className="mt-4 text-[23px]/8 font-semibold tracking-tight">
        “{r.title}”
      </h3>
      {body && <p className="mt-2 leading-7 text-neutral-700">{body}</p>}

      <dl className="mt-4 space-y-4">
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

      {/* mt-auto pins the reviewer to the bottom so cards in a row line up. */}
      <div className="mt-auto pt-6">
        <footer className="flex items-start gap-3 border-t border-neutral-200 pt-4 text-sm">
          {/* Pixelated generated avatar, seeded by the reviewer's name */}
          <FallbackAvatar
            name={r.reviewer.name}
            // neutral gray for any review added without a color
            color={avatarColors[r.id] ?? [60, 0, 0]}
            size={40}
            cols={32}
            className="mt-0.5"
          />
          <div>
            <p className="font-medium">{r.reviewer.name}</p>
            {role && <p className="text-neutral-600">{role}</p>}
            {r.reviewer.used_software_for && (
              <p className="text-neutral-500">
                Used TeeQuest for {r.reviewer.used_software_for.toLowerCase()}
              </p>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
