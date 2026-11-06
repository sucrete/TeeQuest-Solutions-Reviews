const SOURCE_URL = "https://www.capterra.com/p/155560/TeeQuest/reviews/";

const reviews = [
  {
    name: "Andrew S.", role: "General Manager", date: "2025-09-20", displayDate: "September 20, 2025", rating: 5,
    title: "TeeQuest — Recommended for Golf Clubs",
    summary: "Andrew says TeeQuest supports a multimillion-dollar operation with an intuitive, customizable tee sheet and a team he can count on for timely solutions.",
    topics: ["Tee sheet", "Support", "Operations"]
  },
  {
    name: "Paul C.", role: "Assistant Golf Professional", date: "2025-10-29", displayDate: "October 29, 2025", rating: 5,
    title: "Awesome Point of Sale",
    summary: "Paul highlights the clean POS experience, easy staff adoption, steady tee-sheet improvements, and customer support that stays helpful during daily operations.",
    topics: ["Point of sale", "Support", "Ease of use"]
  },
  {
    name: "Ashton V.", role: "General Manager", date: "2025-04-29", displayDate: "April 29, 2025", rating: 5,
    title: "Shirkey Golf Course TeeQuest Review",
    summary: "Ashton says the team makes questions easy to ask, solves issues quickly, and provides a system employees genuinely enjoy using.",
    topics: ["Support", "Staff training", "Reliability"]
  },
  {
    name: "Scott D.", role: "Head Professional", date: "2024-12-16", displayDate: "December 16, 2024", rating: 5,
    title: "Royal Hylands",
    summary: "Scott reports a satisfying two-year experience, calling out ease of use, control over course specials, responsive support, and strong day-to-day value.",
    topics: ["Ease of use", "Promotions", "Support"]
  },
  {
    name: "Karen G.", role: "Owner, Secretary & Treasurer", date: "2024-11-14", displayDate: "November 14, 2024", rating: 5,
    title: "The Best Business Partner Is TeeQuest",
    summary: "Karen values the easy POS and tee sheet, deep reporting, offline flexibility, gift-card tools, and a highly responsive team that feels like a business partner.",
    topics: ["Partnership", "Reporting", "Support"]
  },
  {
    name: "Mel P.", role: "General Manager", date: "2024-08-20", displayDate: "August 20, 2024", rating: 4,
    title: "Rating on TeeQuest",
    summary: "Mel describes a very good overall experience, with an easy system and dependable people to call whenever help is needed.",
    topics: ["Ease of use", "Support"]
  },
  {
    name: "Donnie B.", role: "General Manager & Head Golf Professional", date: "2024-08-13", displayDate: "August 13, 2024", rating: 5,
    title: "TeeQuest Solutions",
    summary: "Donnie praises the user-friendly workflow, straightforward employee training, and the ability to reach a real support person quickly when questions arise.",
    topics: ["Staff training", "Support", "Point of sale"]
  },
  {
    name: "Austin H.", role: "Head Golf Professional", date: "2024-06-27", displayDate: "June 27, 2024", rating: 5,
    title: "Your #1 Golf Course POS Solution",
    summary: "Austin calls TeeQuest the simplest golf-course POS he has used, saying transactions are easy and the customer support is unmatched.",
    topics: ["Point of sale", "Ease of use", "Support"]
  },
  {
    name: "Patricia C.", role: "Owner", date: "2024-05-01", displayDate: "May 2024", rating: 5,
    title: "Review of TeeQuest POS System",
    summary: "Patricia highlights professional onboarding, patient training, imported legacy data, useful reports, 24/7 online booking, and more time to focus on customers.",
    topics: ["Onboarding", "Online booking", "Reporting"]
  },
  {
    name: "Fred I.", role: "Assistant Golf Course Manager & Tournament Director", date: "2024-05-18", displayDate: "May 18, 2024", rating: 5,
    title: "Best POS I’ve Used",
    summary: "Fred describes the POS as simple, configurable, and easy for new employees to learn, adding that early questions were addressed and resolved.",
    topics: ["Point of sale", "Staff training", "Reliability"]
  },
  {
    name: "Kevin L.", role: "General Manager & Superintendent", date: "2021-09-27", displayDate: "September 27, 2021", rating: 5,
    title: "Saving",
    summary: "Kevin says the system is user-friendly for employees and managers and makes golfer check-in noticeably faster.",
    topics: ["Check-in", "Ease of use", "Staff"]
  },
  {
    name: "Larry Y.", role: "General Manager", date: "2021-10-14", displayDate: "October 14, 2021", rating: 5,
    title: "TeeQuest",
    summary: "Larry says TeeQuest was the better fit for the course’s needs and credits its outstanding support and responsive, right-sized team.",
    topics: ["Support", "Product fit", "Partnership"]
  },
  {
    name: "Hank E.", role: "Head PGA Golf Professional", date: "2021-09-14", displayDate: "September 14, 2021", rating: 5,
    title: "Redfield Review",
    summary: "Hank values having direct control over the course website and online booking rates and reports being very happy with the system.",
    topics: ["Website", "Online booking", "Control"]
  },
  {
    name: "Jerrod K.", role: "Golf Shop Manager", date: "2021-09-14", displayDate: "September 14, 2021", rating: 5,
    title: "TeeQuest Review",
    summary: "Jerrod reports a problem-free experience and says the software is straightforward, difficult to misuse, and very easy for staff to learn.",
    topics: ["Ease of use", "Staff training", "Reliability"]
  },
  {
    name: "Kevin C.", role: "Superintendent & General Manager", date: "2021-09-14", displayDate: "September 14, 2021", rating: 5,
    title: "Easy Update",
    summary: "Kevin says the move from the prior system matched the sales promise, with a smooth transition, minimal learning curve, and simple reporting.",
    topics: ["Onboarding", "Reporting", "Staff training"]
  },
  {
    name: "Jonathan D.", role: "Golf Course Manager", date: "2021-09-11", displayDate: "September 11, 2021", rating: 5,
    title: "TeeQuest Is a Solid Product",
    summary: "Jonathan highlights personal, punctual support and an intuitive design that part-time employees learn quickly—a major change from a larger provider.",
    topics: ["Support", "Ease of use", "Staff training"]
  },
  {
    name: "Ron O.", role: "General Manager", date: "2020-07-31", displayDate: "July 31, 2020", rating: 5,
    title: "TeeQuest Golf Software",
    summary: "Ron calls the experience excellent, praising the simple staff workflow, smooth movement from tee sheet to POS, member tools, reports, and support.",
    topics: ["Point of sale", "Tee sheet", "Reporting"]
  },
  {
    name: "Rick L.", role: "Manager", date: "2020-07-16", displayDate: "July 16, 2020", rating: 5,
    title: "Top-Notch Support",
    summary: "Rick says the POS and tee-sheet combination gave the course control of tee-time sales again, backed by responsive, easy-to-reach support.",
    topics: ["Support", "Tee sheet", "Control"]
  },
  {
    name: "Brad S.", role: "Recreation Manager", date: "2020-07-09", displayDate: "July 9, 2020", rating: 5,
    title: "TeeQuest Review",
    summary: "Brad highlights top-notch service, approachable in-person training, touchscreen operation, smooth tee-sheet-to-POS movement, and useful reports.",
    topics: ["Onboarding", "Point of sale", "Reporting"]
  },
  {
    name: "Riley W.", role: "General Manager", date: "2018-10-10", displayDate: "October 10, 2018", rating: 5,
    title: "Beech Creek Golf Club TeeQuest Review",
    summary: "Riley values freedom from trade times, control over discounting, a smooth transition, and strong overall software performance.",
    topics: ["Revenue control", "Onboarding", "Tee sheet"]
  },
  {
    name: "Conrad K.", role: "Sales Representative", date: "2018-06-08", displayDate: "June 8, 2018", rating: 5,
    title: "So Many Features in One System",
    summary: "Conrad says TeeQuest makes tee times, inventory, and food-and-beverage management easy within one broad, dependable platform.",
    topics: ["All-in-one", "Inventory", "Food & beverage"]
  },
  {
    name: "Austin U.", role: "Director of Golf", date: "2018-05-31", displayDate: "May 31, 2018", rating: 5,
    title: "The Best of More Than a Dozen POS Systems",
    summary: "Austin says TeeQuest simplified operations, saved substantial time and money, and made POS, inventory, specials, and tournament-day organization easier.",
    topics: ["Point of sale", "Inventory", "Efficiency"]
  },
  {
    name: "Andrew P.", role: "Manager", date: "2018-06-04", displayDate: "June 4, 2018", rating: 4,
    title: "Outstanding Golf Course POS Solution",
    summary: "Andrew describes TeeQuest as reliable, easy to use, reasonably priced, and backed by great service, while noting room for more website customization at the time.",
    topics: ["Point of sale", "Value", "Reliability"]
  },
  {
    name: "John B.", role: "PGA General Manager", date: "2018-03-01", displayDate: "March 1, 2018", rating: 5,
    title: "I Could Not Be as Successful Without TeeQuest",
    summary: "John says TeeQuest simplified the tee sheet, round tracking, and physical inventory, while strong training and offline mode kept staff confident.",
    topics: ["Tee sheet", "Inventory", "Offline mode"]
  },
  {
    name: "Eric R.", role: "General Manager", date: "2018-03-05", displayDate: "March 5, 2018", rating: 5,
    title: "A Full-Service Provider",
    summary: "Eric says a decade with TeeQuest feels more like a partnership than a vendor relationship, with feedback-driven improvements and support during difficult course hours.",
    topics: ["Partnership", "Support", "Longevity"]
  },
  {
    name: "Chuck E.", role: "General Manager", date: "2018-02-23", displayDate: "February 23, 2018", rating: 5,
    title: "A Great Company",
    summary: "Chuck says TeeQuest has been a joy to work with since 2007 and responds immediately when hardware, software, or booking questions arise.",
    topics: ["Longevity", "Support", "Reliability"]
  },
  {
    name: "Eddie H.", role: "General Manager", date: "2018-02-22", displayDate: "February 22, 2018", rating: 5,
    title: "Great Company and Great Software",
    summary: "Eddie says TeeQuest makes a 36-hole operation straightforward, supports online-booking revenue, and frees pro-shop staff to focus on customers.",
    topics: ["Multi-course", "Online booking", "Efficiency"]
  },
  {
    name: "Shane G.", role: "PGA Professional", date: "2018-02-22", displayDate: "February 22, 2018", rating: 5,
    title: "The Best Fit for Our Seven Courses",
    summary: "Shane says staff adopted TeeQuest quickly across seven courses and that the team listened, answered questions, and adjusted the system during transition.",
    topics: ["Multi-course", "Onboarding", "Support"]
  },
  {
    name: "Alec O.", role: "General Manager", date: "2018-02-01", displayDate: "February 2018", rating: 4,
    title: "Very Pleased With the Ease of Use",
    summary: "Alec highlights a simplified POS that builds staff confidence and flexible tee-time placement that helps maximize revenue and player access.",
    topics: ["Point of sale", "Revenue", "Ease of use"]
  },
  {
    name: "Christopher B.", role: "General Manager", date: "2017-09-08", displayDate: "September 8, 2017", rating: 4,
    title: "Great People to Work With",
    summary: "Christopher found TeeQuest far more reliable than the previous system and praised its straightforward interface and fast, effective support.",
    topics: ["Reliability", "Ease of use", "Support"]
  },
  {
    name: "Matt R.", role: "Verified Reviewer", date: "2016-10-25", displayDate: "October 25, 2016", rating: 5,
    title: "TeeQuest Solutions Review",
    summary: "Matt says pre-planning, installation, and training produced the easiest software implementation his facilities had experienced, with quick staff adoption.",
    topics: ["Onboarding", "Implementation", "Staff training"]
  }
];

const grid = document.querySelector("#review-grid");
const searchInput = document.querySelector("#review-search");
const sortSelect = document.querySelector("#review-sort");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const resultCount = document.querySelector("#result-count");
const clearButton = document.querySelector("#clear-filters");
const emptyState = document.querySelector("#empty-state");
const emptyClear = document.querySelector("#empty-clear");
let activeRating = "all";

const initials = (name) => name.split(/\s+/).map((part) => part[0]).join("").replace(".", "").slice(0, 2).toUpperCase();
const starString = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);
const escapeHtml = (value) => value.replace(/[&<>"]/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[character]));

function cardTemplate(review) {
  return `
    <article class="review-card">
      <div class="card-top">
        <span class="review-stars" aria-label="${review.rating} out of 5 stars">${starString(review.rating)}</span>
        <span class="review-rating">${review.rating}.0 / 5</span>
      </div>
      <h3>${escapeHtml(review.title)}</h3>
      <p class="review-summary">${escapeHtml(review.summary)}</p>
      <ul class="topic-list" aria-label="Topics">${review.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>
      <div class="reviewer">
        <span class="avatar" aria-hidden="true">${initials(review.name)}</span>
        <div><strong>${escapeHtml(review.name)}</strong><span>${escapeHtml(review.role)}</span></div>
      </div>
      <div class="review-source">
        <span>${escapeHtml(review.displayDate)}</span>
        <a href="${SOURCE_URL}" aria-label="View ${escapeHtml(review.name)}'s full review on Capterra">Full review on Capterra ↗</a>
      </div>
    </article>`;
}

function renderReviews() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = reviews.filter((review) => {
    const matchesRating = activeRating === "all" || review.rating === Number(activeRating);
    const haystack = [review.name, review.role, review.title, review.summary, ...review.topics].join(" ").toLowerCase();
    return matchesRating && haystack.includes(query);
  });

  visible.sort((a, b) => {
    if (sortSelect.value === "oldest") return a.date.localeCompare(b.date);
    if (sortSelect.value === "rating") return b.rating - a.rating || b.date.localeCompare(a.date);
    return b.date.localeCompare(a.date);
  });

  grid.innerHTML = visible.map(cardTemplate).join("");
  const plural = visible.length === 1 ? "review" : "reviews";
  resultCount.textContent = `${visible.length} ${plural}`;
  const filtersActive = activeRating !== "all" || query.length > 0;
  clearButton.hidden = !filtersActive;
  emptyState.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
}

function clearFilters() {
  activeRating = "all";
  searchInput.value = "";
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.rating === "all"));
  renderReviews();
  searchInput.focus();
}

searchInput.addEventListener("input", renderReviews);
sortSelect.addEventListener("change", renderReviews);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeRating = button.dataset.rating;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderReviews();
  });
});
clearButton.addEventListener("click", clearFilters);
emptyClear.addEventListener("click", clearFilters);
document.querySelector("#year").textContent = new Date().getFullYear();

renderReviews();
