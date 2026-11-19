import { FallbackAvatar } from "@/components/FallbackAvatar";
import { avatarColors } from "@/data/avatar-colors";
import {
  formatDate,
  reviewBody,
  reviewLikes,
  sourceUrl,
  type Review,
} from "@/lib/reviews";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* a small heading: sans, semibold, near-black (overriding the
          global mono uppercase <dt> style) */}
      <dt className="font-sans text-base font-semibold tracking-tight text-neutral-900 normal-case">
        {label}
      </dt>
      <dd className="mt-1 leading-7 text-neutral-600">{children}</dd>
    </div>
  );
}

export function ReviewCard({ review: r }: { review: Review }) {
  const body = reviewBody(r);
  const likes = reviewLikes(r);
  const role = [r.reviewer.title, r.reviewer.industry]
    .filter(Boolean)
    .join(", ");

  return (
    // shadow-md/5 at rest; on hover: a soft shadow (shadow-xl at 5% black) plus a faint 5px ring that grows out from
    // behind the card (ring-0 to ring-5; both are box-shadows, so
    // transition-shadow animates them together)
    <article className="flex h-full flex-col rounded-[22px] border border-neutral-200 bg-white p-8 shadow-md/5 ring-0 ring-[#00000005] transition-shadow duration-300 ease-out hover:shadow-xl/5 hover:ring-5">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p aria-label={`Rated ${r.rating} out of 5`}>
          <span aria-hidden="true">
            <span className="text-[#ffcf02]">{"★".repeat(r.rating)}</span>
            <span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span>
          </span>{" "}
          <span className="font-medium">{r.rating.toFixed(1)}</span>
        </p>
        {/* Departure Mono, uppercase and 12px on desktop like all mono
            text. The whole "Capterra, date" line links to that review's
            permalink on Capterra (url in reviews.json), in a new tab;
            TeeQuest's Capterra reviews page if a review has no url. */}
        <a
          href={r.url ?? sourceUrl}
          target="_blank"
          rel="noopener"
          className="font-mono text-sm text-neutral-500 uppercase underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-black hover:decoration-current md:text-xs"
        >
          Capterra, <time dateTime={r.date}>{formatDate(r.date)}</time>
        </a>
      </div>

      <h3 className="mt-4 text-[23px]/8 font-semibold tracking-tight">
        “{r.title}”
      </h3>
      {body && <p className="mt-2 leading-7 text-neutral-600">{body}</p>}

      <dl className="mt-4 space-y-4">
        {likes && (
          <Field label="What do you like best about TeeQuest?">{likes}</Field>
        )}
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
