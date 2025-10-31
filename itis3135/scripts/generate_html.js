(function () {
  // ---------- helpers ----------
  function esc(s) {
    if (s === null || s === undefined) s = "";
    s = String(s);
    // Use regex (works everywhere)
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getVal(form, selector) {
    var el = form.querySelector(selector);
    return el && typeof el.value !== "undefined" ? el.value : "";
  }

  function collectCourses() {
    var ul = document.querySelector("#courses");
    if (!ul) return [];
    var lis = ul.querySelectorAll("li");
    var out = [];
    for (var i = 0; i < lis.length; i++) {
      var li = lis[i];
      var input = li.querySelector("input, textarea");
      var txt = input ? input.value : li.textContent;
      txt = txt ? String(txt).trim() : "";
      if (txt) out.push(txt);
    }
    return out;
  }

  function collectBullets(form) {
    var ids = ["b1","b2","b3","b4","b5","b6","b7"];
    var out = [];
    for (var i = 0; i < ids.length; i++) {
      var el = form.querySelector("#" + ids[i]);
      var v = el && el.value ? String(el.value).trim() : "";
      if (v) out.push(v);
    }
    return out;
  }

  function buildIntroHtml(form) {
    var first       = getVal(form, "#firstName");
    var middle      = getVal(form, "#middleName");
    var last        = getVal(form, "#lastName");
    var nick        = getVal(form, "#nickname");

    var mascotAdj   = getVal(form, "#mascotAdj");
    var mascotAnimal= getVal(form, "#mascotAnimal");

    var picUrl      = getVal(form, "#pictureUrl");
    var picCap      = getVal(form, "#pictureCap");
    var personal    = getVal(form, "#personalStatement");

    var bullets     = collectBullets(form);
    var courses     = collectCourses();

    var quote       = getVal(form, "#quote");
    var quoteAuthor = getVal(form, "#quoteAuthor");
    var funny       = getVal(form, "#funny");
    var share       = getVal(form, "#share");

    var fullName = [first, middle, last].filter(function(x){ return x && x.trim(); }).join(" ");
    var titleRight = [mascotAdj, mascotAnimal].filter(function(x){ return x && x.trim(); }).join(" ");
    var nameLine = fullName + (nick ? (' "' + nick + '"') : "");
    var starTitle = [nameLine, titleRight].filter(function(x){ return x && x.trim(); }).join(" ★ ");

    var figure = picUrl ? (
`<figure>
  <img src="${esc(picUrl)}" alt="Photo of ${esc(fullName)}">
  ${picCap ? `<figcaption>${esc(picCap)}</figcaption>` : ""}
</figure>`
    ) : "";

    var bulletsBlock = bullets.length ? (
`  <li><strong>Main Points:</strong>
    <ul>
${bullets.map(function(b){ return "      <li>" + esc(b) + "</li>"; }).join("\n")}
    </ul>
  </li>`
    ) : "";

    var coursesBlock = courses.length ? (
`  <li><strong>Courses:</strong>
    <ul>
${courses.map(function(c){ return "      <li>" + esc(c) + "</li>"; }).join("\n")}
    </ul>
  </li>`
    ) : "";

    var quoteBlock = quote ? `  <li><strong>Quote:</strong> “${esc(quote)}” — ${esc(quoteAuthor)}</li>` : "";
    var funnyBlock = funny ? `  <li><strong>Funny thing:</strong> ${esc(funny)}</li>` : "";
    var shareBlock = share ? `  <li><strong>Something I’d like to share:</strong> ${esc(share)}</li>` : "";

    return `<h2>Introduction HTML</h2>
${starTitle ? `<h3>${esc(starTitle)}</h3>` : ""}${figure}
<ul>
  <li><strong>Personal Statement:</strong> ${esc(personal)}</li>${bulletsBlock}${coursesBlock}${quoteBlock}${funnyBlock}${shareBlock}
</ul>`;
  }

  // ---------- anchor management (always insert above footer) ----------
  var beforeFooterAnchor = null;

  function ensureAnchorBeforeFooter() {
    if (beforeFooterAnchor && beforeFooterAnchor.parentNode) return beforeFooterAnchor;

    var main = document.querySelector("main") || document.body;
    var includeSel = 'div[data-include="components/footer.html"]';
    var inc = document.querySelector(includeSel);

    beforeFooterAnchor = document.createComment("generated-html-anchor");

    if (inc && inc.parentNode) {
      inc.parentNode.insertBefore(beforeFooterAnchor, inc);
    } else {
      var footerLike = document.querySelector("footer, .site-footer, #footer");
      if (footerLike && footerLike.parentNode) {
        footerLike.parentNode.insertBefore(beforeFooterAnchor, footerLike);
      } else if (main && main.lastElementChild && main.lastElementChild.parentNode) {
        main.lastElementChild.parentNode.insertBefore(beforeFooterAnchor, main.lastElementChild);
      } else {
        main.appendChild(beforeFooterAnchor);
      }
    }
    return beforeFooterAnchor;
  }

  function watchForFooter() {
    // MutationObserver is widely supported; if absent, we just skip
    if (typeof MutationObserver === "function") {
      var mo = new MutationObserver(function () {
        if (!beforeFooterAnchor || !beforeFooterAnchor.parentNode) {
          ensureAnchorBeforeFooter();
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  // ---------- main action ----------
  function generateHTML() {
    var form = document.querySelector("#form");
    if (!form) {
      alert("Error: Could not find the form (#form)");
      return;
    }

    var introHtml = buildIntroHtml(form);

    var h2 = document.querySelector("h2");
    if (h2) h2.textContent = "Introduction HTML";

    form.style.display = "none";

    var section = document.createElement("section");
    section.id = "generated-section";

    var pre = document.createElement("pre");
    var code = document.createElement("code");
    code.textContent = introHtml; // literal, copyable HTML
    pre.appendChild(code);
    section.appendChild(pre);

    // Inline styling
    section.style.margin = "2rem 0";
    pre.style.backgroundColor = "#1e1e1e";
    pre.style.color = "#69FFF1";   // change to your preferred color
    pre.style.padding = "1rem";
    pre.style.borderRadius = "8px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";
    pre.style.fontFamily = "monospace";

    var anchor = ensureAnchorBeforeFooter();
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(section, anchor);
    } else {
      // absolute fallback
      (document.querySelector("main") || document.body).appendChild(section);
    }

    // optional scroll into view
    if (section.scrollIntoView) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function wire() {
    var btn = document.querySelector("#generateHtmlBtn");
    if (btn) btn.addEventListener("click", generateHTML);
    window.generateHTML = generateHTML; // optional inline fallback
    ensureAnchorBeforeFooter();
    watchForFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();