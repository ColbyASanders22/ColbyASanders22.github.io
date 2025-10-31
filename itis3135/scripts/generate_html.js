(() => {
  // ---------- helpers ----------
const esc = (s) => {
  s = (s === null || s === undefined) ? "" : String(s);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

  const collectCourses = () => {
    const ul = document.querySelector("#courses");
    if (!ul) return [];
    return [...ul.querySelectorAll("li")]
      .map(li => {
        const input = li.querySelector("input, textarea");
        return (input ? input.value : li.textContent || "").trim();
      })
      .filter(Boolean);
  };

  const collectBullets = (form) => {
    const ids = ["b1","b2","b3","b4","b5","b6","b7"];
    return ids.map(id => {
  const el = form.querySelector("#" + id);
  return el && el.value ? el.value.trim() : "";
}).filter(Boolean);
  };

  const buildIntroHtml = (form) => {
const firstEl = form.querySelector("#firstName");
const middleEl = form.querySelector("#middleName");
const lastEl = form.querySelector("#lastName");
const nickEl = form.querySelector("#nickname");
const mascotAdjEl = form.querySelector("#mascotAdj");
const mascotAnimalEl = form.querySelector("#mascotAnimal");

const first = firstEl && firstEl.value ? firstEl.value : "";
const middle = middleEl && middleEl.value ? middleEl.value : "";
const last = lastEl && lastEl.value ? lastEl.value : "";
const nick = nickEl && nickEl.value ? nickEl.value : "";
const mascotAdj = mascotAdjEl && mascotAdjEl.value ? mascotAdjEl.value : "";
const mascotAnimal = mascotAnimalEl && mascotAnimalEl.value ? mascotAnimalEl.value : "";

    const picUrl = form.querySelector("#pictureUrl")?.value || "";
    const picCap = form.querySelector("#pictureCap")?.value || "";
    const personal = form.querySelector("#personalStatement")?.value || "";
    const bullets = collectBullets(form);
    const courses = collectCourses();

    const quote = form.querySelector("#quote")?.value || "";
    const quoteAuthor = form.querySelector("#quoteAuthor")?.value || "";
    const funny = form.querySelector("#funny")?.value || "";
    const share = form.querySelector("#share")?.value || "";

    const fullName = [first, middle, last].filter(Boolean).join(" ");
    const starTitle = [
      `${fullName}${nick ? ' "' + nick + '"' : ""}`,
      [mascotAdj, mascotAnimal].filter(Boolean).join(" ")
    ].filter(Boolean).join(" ★ ");

    const figure = picUrl ? `
<figure>
  <img src="${esc(picUrl)}" alt="Photo of ${esc(fullName)}">
  ${picCap ? `<figcaption>${esc(picCap)}</figcaption>` : ""}
</figure>` : "";

    const bulletsBlock = bullets.length ? `
  <li><strong>Main Points:</strong>
    <ul>
${bullets.map(b => `      <li>${esc(b)}</li>`).join("\n")}
    </ul>
  </li>` : "";

    const coursesBlock = courses.length ? `
  <li><strong>Courses:</strong>
    <ul>
${courses.map(c => `      <li>${esc(c)}</li>`).join("\n")}
    </ul>
  </li>` : "";

    const quoteBlock = quote ? `
  <li><strong>Quote:</strong> “${esc(quote)}” — ${esc(quoteAuthor)}</li>` : "";
    const funnyBlock = funny ? `
  <li><strong>Funny thing:</strong> ${esc(funny)}</li>` : "";
    const shareBlock = share ? `
  <li><strong>Something I’d like to share:</strong> ${esc(share)}</li>` : "";

    return `<h2>Introduction HTML</h2>
${starTitle ? `<h3>${esc(starTitle)}</h3>` : ""}${figure}
<ul>
  <li><strong>Personal Statement:</strong> ${esc(personal)}</li>${bulletsBlock}${coursesBlock}${quoteBlock}${funnyBlock}${shareBlock}
</ul>`;
  };

  // ---------- anchor management (so we can always insert above the footer) ----------
  let beforeFooterAnchor = null;

  const ensureAnchorBeforeFooter = () => {
    if (beforeFooterAnchor && beforeFooterAnchor.isConnected) return beforeFooterAnchor;

    const main = document.querySelector("main") || document.body;
    // find the original include placeholder (if it still exists)
    const includeSel = 'div[data-include="components/footer.html"]';
    const inc = document.querySelector(includeSel);

    // Create an invisible anchor node
    beforeFooterAnchor = document.createComment("generated-html-anchor");

    if (inc && inc.parentNode) {
      // Place anchor immediately BEFORE the include node
      inc.parentNode.insertBefore(beforeFooterAnchor, inc);
    } else {
      // If include already replaced the node, try common footer containers
      const footerLike = document.querySelector("footer, .site-footer, #footer") ||
                         // last resort: last element in main
                         main.lastElementChild;
      if (footerLike && footerLike.parentNode) {
        footerLike.parentNode.insertBefore(beforeFooterAnchor, footerLike);
      } else {
        // absolute fallback: append at the end of main (still above scripts)
        main.appendChild(beforeFooterAnchor);
      }
    }
    return beforeFooterAnchor;
  };

  // If the include later replaces/moves nodes, keep our anchor before footer
  const watchForFooter = () => {
    const mo = new MutationObserver(() => {
      // If we lost the anchor or it's not before a footer-like thing, try to recreate/adjust
      if (!beforeFooterAnchor || !beforeFooterAnchor.isConnected) {
        ensureAnchorBeforeFooter();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  // ---------- main action ----------
  const generateHTML = () => {
    const form = document.querySelector("#form");
    if (!form) {
      alert("Error: Could not find the form (#form)");
      return;
    }

    const introHtml = buildIntroHtml(form);

    // Change heading + hide form
    const h2 = document.querySelector("h2");
    if (h2) h2.textContent = "Introduction HTML";
    form.style.display = "none";

    // Build section with code block
    const section = document.createElement("section");
    section.id = "generated-section";

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = introHtml; // literal, copyable HTML
    pre.appendChild(code);
    section.appendChild(pre);

    // Inline styling (edit to taste)
    section.style.margin = "2rem 0";
    pre.style.backgroundColor = "#1e1e1e";
    pre.style.color = "#69FFF1";     // text color for generated code
    pre.style.padding = "1rem";
    pre.style.borderRadius = "8px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";
    pre.style.fontFamily = "monospace";

    // Ensure anchor exists before footer, then insert BEFORE the anchor
    const anchor = ensureAnchorBeforeFooter();
    anchor.parentNode.insertBefore(section, anchor);

    // optional: scroll to it
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---------- wiring ----------
  const wire = () => {
    document.querySelector("#generateHtmlBtn")?.addEventListener("click", generateHTML);
    window.generateHTML = generateHTML; // optional inline fallback
    ensureAnchorBeforeFooter();
    watchForFooter();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();