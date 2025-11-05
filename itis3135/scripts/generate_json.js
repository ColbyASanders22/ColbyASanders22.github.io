(function () {
  // ---------- Helper Functions ----------
  function $(id) {
    return document.getElementById(id);
  }
  function val(id) {
    var el = $(id);
    return el ? String(el.value || "").trim() : "";
  }

  // ---------- Parse Courses ----------
  function parseCourses() {
    var root = $("courses");
    if (!root) return [];

    var rows = Array.from(
      root.querySelectorAll("li, .course-row, [data-course-row]")
    );

    var FIELD_PATTERNS = [
      { key: "department", test: /dept|department/i },
      { key: "number",     test: /\bnumber\b|(^|[^a-z])num([^a-z]|$)/i },
      { key: "name",       test: /\b(name|title|course)\b/i },
      { key: "reason",     test: /reason|why/i }
    ];

    function detectField(input) {
      var label = input.closest("label");
      var labelText = (label && label.textContent ? label.textContent : "").trim();
      var haystack = [
        input.name || "",
        input.id || "",
        input.className || "",
        input.placeholder || "",
        labelText
      ].join(" ").toLowerCase();
      for (var i = 0; i < FIELD_PATTERNS.length; i++) {
        var fp = FIELD_PATTERNS[i];
        if (fp.test.test(haystack)) return fp.key;
      }
      return null;
    }

    function readRow(rowEl) {
      var obj = { department: "", number: "", name: "", reason: "" };
      var inputs = Array.from(rowEl.querySelectorAll("input, select, textarea"));
      inputs.forEach(function (inp) {
        var k = detectField(inp);
        if (k && !obj[k]) obj[k] = String(inp.value || "").trim();
      });
      return obj;
    }

    var result = [];
    if (rows.length) {
      result = rows
        .map(readRow)
        .filter(function (c) {
          return c.department || c.number || c.name || c.reason;
        });
    } else {
      var inputs = Array.from(root.querySelectorAll("input, select, textarea"));
      var current = { department: "", number: "", name: "", reason: "" };
      inputs.forEach(function (inp) {
        var k = detectField(inp);
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
    var middleName = val("middleName");
    var middleInitial = middleName ? middleName[0].toUpperCase() : "";
    var preferredName = val("nickname") || val("firstName");

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
    var form =
      $("form") ||
      $("form#form") ||
      document.querySelector("form#form");
    if (!form) return;

    var titleEl = $("pageTitle") || document.querySelector("h2");
    if (titleEl) titleEl.textContent = "Introduction JSON";

    var section = document.createElement("section");
    section.className = "output-section";

    var h2 = document.createElement("h2");
    h2.textContent = "Your Introduction as JSON";

    var pre = document.createElement("pre");
    pre.className = "output-box";

    var code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonText;

    pre.appendChild(code);
    section.appendChild(h2);
    section.appendChild(pre);

    form.replaceWith(section);

    // syntax highlighting (optional)
    if (window.hljs && typeof window.hljs.highlightElement === "function") {
      try {
        window.hljs.highlightElement(code);
      } catch (e) {
        // ignore highlight.js errors
      }
    }
  }

  // ---------- Generate & Replace ----------
  function handleGenerateJson() {
    var data = buildJson();
    var jsonText = JSON.stringify(data, null, 2);
    showJsonReplacingForm(jsonText);
  }

  // ---------- Initialize ----------
  document.addEventListener("DOMContentLoaded", function () {
    var btn = $("generateJsonBtn");
    if (btn) {
      btn.addEventListener("click", handleGenerateJson);
    }
  });
})();  // close the IIFE
