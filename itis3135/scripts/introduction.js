document
  .querySelector("#clearBtn")
  .addEventListener("click", function () {
    Array.from(document.querySelectorAll("form input")).forEach((input) => {
      if (input.type === "file") input.value = null; else input.value = "";
    });
  });

const clearButton = document.querySelector("#clearBtn");
const inputElements = Array.from(document.querySelectorAll("form input"));
clearButton.addEventListener("click", function () {
  inputElements.forEach((input) => {
    if (input.type === "file") input.value = null; else input.value = "";
  });
});

/* Patch so the second snippet works as written (it references `inputs`) */
const inputs = (typeof inputElements !== "undefined" && inputElements.length)
  ? inputElements
  : Array.from(document.querySelectorAll("form input"));

/* ===== Minimal required logic ===== */
const formElement  = document.getElementById("form");
const resetBtn     = document.getElementById("resetBtn");
const addCourseBtn = document.getElementById("addCourseBtn");
const coursesList  = document.getElementById("courses");

/* Add Course + Remove */
if (addCourseBtn && coursesList) {
  addCourseBtn.addEventListener("click", function () {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>Dept* <input required name="course_dept" placeholder="ITSC"></label>
      <label>Number* <input required name="course_num" type="number" placeholder="3160"></label>
      <label>Name* <input required name="course_name" placeholder="Database Design"></label>
      <label>Reason* <input required name="course_reason" placeholder="Why you're taking it"></label>
      <button type="button" class="delete-course">Remove</button>
    `;
    li.querySelector(".delete-course").addEventListener("click", () => li.remove());
    coursesList.appendChild(li);
  });
}

function addDefaultCourses() {
  if (!coursesList) return;

  // If rows already exist, don't duplicate
  const alreadyHasRows = coursesList.children.length > 0 && coursesList.querySelector("input");
  if (alreadyHasRows) return;

  const DEFAULT_COURSES = [
    {
      dept: "ITSC",
      num: "3146",
      cname: "Intro Oper Syst & Networking",
      reason: "I am interested in networking and how everything is interconnected."
    },
    {
      dept: "ITSC",
      num: "2175",
      cname: "Logic and Algorithms",
      reason: "I am curious how algorithms work as they can be extremely useful in real world applications."
    },
    {
      dept: "ITIS",
      num: "3135",
      cname: "Front-End Web App Development",
      reason: "I am interested in making web applications."
    },
    {
      dept: "ITSC",
      num: "3160",
      cname: "Database Design & Implementation",
      reason: "Databases are another extremely useful tool in the real world and it is important to make sure that they are implemented properly."
    },
    {
      dept: "MATH",
      num: "2164",
      cname: "Matrices & Linear Algebra",
      reason: "It is a part of the curriculum. I am not a big math fan, unfortunately."
    }
  ];

  DEFAULT_COURSES.forEach(prefill => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>Dept* <input required name="course_dept" placeholder="ITSC" value="${prefill.dept}"></label>
      <label>Number* <input required name="course_num" type="number" placeholder="3160" value="${prefill.num}"></label>
      <label>Name* <input required name="course_name" placeholder="Database Design" value="${prefill.cname}"></label>
      <label>Reason* <input required name="course_reason" placeholder="Why you're taking it" value="${prefill.reason}"></label>
      <button type="button" class="delete-course">Remove</button>
    `;
    li.querySelector(".delete-course").addEventListener("click", () => li.remove());
    coursesList.appendChild(li);
  });
}

// Run once on load
addDefaultCourses();

// Also repopulate after a Reset (reuses your existing reset handler)
if (resetBtn && coursesList) {
  resetBtn.addEventListener("click", function () {
    setTimeout(() => {
      coursesList.innerHTML = "";
      addDefaultCourses();
    }, 0);
  });
}

/* Single source of truth: FORM SUBMIT — replace ENTIRE PAGE */
if (formElement) {
  formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!formElement.checkValidity()) {
      alert("Please complete all required fields.");
      return;
    }

    const get = (id) => (document.getElementById(id) ? document.getElementById(id).value : "");

    const mascotAdj        = get("mascotAdj");
    const mascotAnimal     = get("mascotAnimal");
    const pictureUrl       = get("pictureUrl");
    const pictureCap       = get("pictureCap");
    const firstName        = get("firstName");
    const middleName       = get("middleName");
    const lastName         = get("lastName");
    const personalStatement= get("personalStatement");
    const quote            = get("quote");
    const quoteAuthor      = get("quoteAuthor");
    const divider          = get("divider") || "~";

    const bullets = ["b1","b2","b3","b4","b5","b6","b7"].map(get).filter(Boolean);
    const links   = ["link1","link2","link3","link4","link5"].map(get).filter(Boolean);

    const courseItems = coursesList
      ? Array.from(coursesList.querySelectorAll("li")).map((li) => {
          const q = (sel) => {
        const el = li.querySelector(sel);
        return el ? el.value : "";
        };
          return `${q('input[name="course_dept"]')} ${q('input[name="course_num"]')} — ${q('input[name="course_name"]')} :: ${q('input[name="course_reason"]')}`;
        })
      : [];


    // Uploaded image overrides URL
    const picInput = document.getElementById("pictureFile");
    const picFile = picInput && picInput.files && picInput.files[0] ? picInput.files[0] : null;
    let finalImgSrc = pictureUrl;
    if (picFile) finalImgSrc = URL.createObjectURL(picFile);

    // Replace EVERYTHING on the page with the generated intro
document.body.innerHTML = `
  <main style="max-width:800px;margin:0 auto;padding:1rem;box-sizing:border-box;">
    <h2>${mascotAdj} ${mascotAnimal}</h2>

    <figure>
      <img src="${finalImgSrc}" alt="${firstName} ${lastName}" style="max-width:220px;">
      <figcaption>${pictureCap}</figcaption>
    </figure>

    <h3>${[firstName, middleName, lastName].filter(Boolean).join(" ")}</h3>
    <p>${personalStatement}</p>

${
  bullets.length
    ? `<ul>
        ${bullets[0] ? `<li><strong>Personal Background:</strong> ${bullets[0]}</li>` : ""}
        ${bullets[1] ? `<li><strong>Professional Background:</strong> ${bullets[1]}</li>` : ""}
        ${bullets[2] ? `<li><strong>Academic Background:</strong> ${bullets[2]}</li>` : ""}
        ${bullets.slice(3).map(function(b){ return `<li>${b}</li>`; }).join("")}
       </ul>`
    : ""
}

    ${courseItems.length
      ? `<h4>Current Courses</h4><ol>${courseItems.map(function(c){ return `<li>${c}</li>`; }).join("")}</ol>`
      : ""}

    <blockquote>“${quote}” — ${quoteAuthor}</blockquote>

    ${links.length
      ? `<h4>Links</h4><ul>${links.map(function(u,i){
            return `<li><a href="${u}" target="_blank" rel="noopener">Link ${i+1}</a></li>`;
          }).join("")}</ul>`
      : ""}

    <hr>
    <p>${divider.repeat(30)}</p>

    <p style="margin-top:1rem;">
      <a href="#" onclick="location.reload()">Start over</a>
    </p>
  </main>
`;
  });
}

/* Reset: remove added course rows after browser reset */
if (resetBtn && coursesList) {
  resetBtn.addEventListener("click", function () {
    setTimeout(() => { coursesList.innerHTML = ""; }, 0);
  });
}
