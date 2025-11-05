(function () {
  // ---------- Helper Functions ----------
  const $ = (id) => document.getElementById(id);
  const val = (id) => {
    const el = $(id);
    return el ? String(el.value || "").trim() : "";
  };

  // ---------- Parse Courses ----------
  function parseCourses() {
    const root = $("courses");
    if (!root) return [];

    const rows = Array.from(
      root.querySelectorAll("li, .course-row, [data-course-row]")
    );

    const FIELD_PATTERNS = [
      { key: "department", test: /dept|department/i },
      { key: "number",     test: /\bnumber\b|(^|[^a-z])num([^a-z]|$)/i },
      { key: "name",       test: /\b(name|title|course)\b/i },
      { key: "reason",     test: /reason|why/i }
    ];

    const detectField = (input) => {
      const label = input.closest("label");
      const labelText = (label && label.textContent ? label.textContent : "").trim();
      const haystack = [
        input.name || "",
        input.id || "",
        input.className || "",
        input.placeholder || "",
        labelText
      ].join(" ").toLowerCase();
      for (const { key, test } of FIELD_PATTERNS) {
        if (test.test(haystack)) return key;
      }
      return null;
    };

    const readRow = (rowEl) => {
      const obj = { department: "", number: "", name: "", reason: "" };
      const inputs = Array.from(rowEl.querySelectorAll("input, select, textarea"));
      inputs.forEach((inp) => {
        const k = detectField(inp);
        if (k && !obj[k]) obj[k] = String(inp.value || "").trim();
      });
      return obj;
    };

    let result = [];
    if (rows.length) {
      result = rows
        .map(readRow)
        .filter((c) => c.department || c.number || c.name || c.reason);
    } else {
      const inputs = Array.from(root.querySelectorAll("input, select, textarea"));
      let current = { department: "", number: "", name: "", reason: "" };
      inputs.forEach((inp) => {
        const k = detectField(inp);
        if (!k) return;
        if (current[k]) {
          if (current.department || current.number || current.name || current.reason) {
            result.push(current);
          }
          current = { department: "", number: "", name: "", reason: "" };
        }
        current[k] = String(inp.value || "").trim();
      });
      if (current.department || current.number || current.name || current.reason) {
        result.push(current);
      }
    }

    return result;
  }

  // ---------- Build JSON ----------
  function buildJson() {
    const middleName = val("middleName");
    const middleInitial = middleName ? middleName[0].toUpperCase() : "";
    const preferredName = val("nickname") || val("firstName");

    return {
      firstName: val("firstName"),
      preferredName: preferredName,
      middleInitial: middleInitial,
      lastName: val("lastName"),
      divider: val("divider"),
      mascotAdjective: val("mascotAdj"),
      mascotAnimal: val("mascotAnimal"),
      image: val("pictureUrl"),
      imageCaption: val("pictureCap"),
      personalStatement: val("personalStatement"),
      personalBackground: val("b1"),
      professionalBackground: val("b2"),
      academicBackground: val("b3"),
      courses: parseCourses()
    };
  }

  // ---------- Display JSON ----------
  function showJsonReplacingForm(jsonText) {
    const form = $("form") || $("form#form") || document.querySelector("form#form");
    if (!form) return;

    const titleEl = $("pageTitle") || document.querySelector("h2");
    if (titleEl) titleEl.textContent = "Introduction JSON";

    // Section wrapper styled similarly to generate_html.js
    const section = document.createElement("section");
    section.className = "output-section";

    const h2 = document.createElement("h2");
    h2.textContent = "Your Introduction as JSON";

    const pre = document.createElement("pre");
    pre.className = "output-box";
    const code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonText;

    pre.appendChild(code);
    section.appendChild(h2);
    section.appendChild(pre);

    form.replaceWith(section);

if (window.hljs && typeof window.hljs.highlightElement === "function") {
  try {
    window.hljs.highlightElement(code);
  } catch (_) {
    // ignore highlight.js errors
  }
} // closes the if properly

// -------- Generate & Replace --------
function handleGenerateJson() {
  const data = buildJson();
  const jsonText = JSON.stringify(data, null, 2);
  showJsonReplacingForm(jsonText);
}

  // ---------- Initialize ----------
  document.addEventListener("DOMContentLoaded", () => {
    const btn = $("generateJsonBtn");
    if (btn) btn.addEventListener("click", handleGenerateJson);
  });