/**
 * Hunter's Guitar Lessons - Lesson Price Calculator
 * Interactivity: Dynamic cost estimate based on lesson type + number of lessons.
 */

document.addEventListener("DOMContentLoaded", () => {
  const lessonTypeSelect = document.getElementById("calc-lesson-type");
  const lessonCountInput = document.getElementById("calc-lesson-count");
  const summaryEl = document.getElementById("calc-summary");
  const totalEl = document.getElementById("calc-total");

  if (!lessonTypeSelect || !lessonCountInput || !summaryEl || !totalEl) {
    return; // not on this page
  }

  // In case Hunter changes pricing later, we just adjust this object.
  const LESSON_PRICES = {
    beginner: 40,
    intermediate: 40,
    advanced: 40,
    virtual: 40
  };

  const LESSON_LABELS = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    virtual: "Virtual"
  };

  function formatCurrency(amount) {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: "USD"
    });
  }

  function updateCalculator() {
    const typeValue = lessonTypeSelect.value || "beginner";
    const lessonsRaw = Number(lessonCountInput.value);
    const lessonCount = Number.isFinite(lessonsRaw) && lessonsRaw > 0 ? lessonsRaw : 0;

    const pricePerLesson = LESSON_PRICES[typeValue] || 40;
    const label = LESSON_LABELS[typeValue] || "Guitar";

    if (lessonCount <= 0) {
      summaryEl.textContent = "Enter a number of lessons greater than 0.";
      totalEl.textContent = "Estimated total: " + formatCurrency(0);
      return;
    }

    const total = pricePerLesson * lessonCount;

    summaryEl.textContent = `${lessonCount} ${label} lesson${lessonCount === 1 ? "" : "s"} at $${pricePerLesson} each.`;
    totalEl.textContent = `Estimated total: ${formatCurrency(total)}`;
  }

  // Update calculator when inputs change
  lessonTypeSelect.addEventListener("change", updateCalculator);
  lessonCountInput.addEventListener("input", updateCalculator);

  // Initial calculation
  updateCalculator();
});
