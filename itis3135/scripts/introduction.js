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

const pictureFileInput = document.getElementById("pictureFile");
const imagePreview = document.getElementById("imagePreview");

pictureFileInput.addEventListener("change", () => {
  const file = pictureFileInput.files[0];
  imagePreview.src = file ? URL.createObjectURL(file) : "images/skitrip.jpg";
});

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

    ${bullets.length
      ? `<ul>${bullets.map(function(b){ return `<li>${b}</li>`; }).join("")}</ul>`
      : ""}

    ${courseItems.length
      ? `<h4>Current Courses</h4><ul>${courseItems.map(function(c){ return `<li>${c}</li>`; }).join("")}</ul>`
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

