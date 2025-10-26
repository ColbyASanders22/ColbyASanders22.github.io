document
  .querySelector("button[type='button']")
  .addEventListener("click", function (event) {
    Array.from(document.querySelectorAll("form input")).forEach((input) => {
      input.value = "";
    });
  });

const clearButton = document.querySelector("button[type='button']");
const inputElements = Array.from(document.querySelectorAll("form input"));
clearButton.addEventListener("click", function () {
  inputs.forEach((input) => (input.value = ""));
});

/* Patch so the second snippet works as written (it references `inputs`) */
const inputs = (typeof inputElements !== "undefined" && inputElements.length)
  ? inputElements
  : Array.from(document.querySelectorAll("form input"));



const formElement  = document.getElementById("form");
formElement.addEventListener("submit", (e) => e.preventDefault()); // prevents page refresh / default behavior

const submitBtn    = document.getElementById("submitBtn");
const resetBtn     = document.getElementById("resetBtn");
const addCourseBtn = document.getElementById("addCourseBtn");
const coursesList  = document.getElementById("courses");
const result       = document.getElementById("result");
const restartLink  = document.getElementById("restartLink");

/* Add course text boxes + delete button (Dept, Number, Name, Reason) */
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

/* Submit: validate + render intro in place of form */
submitBtn.addEventListener("click", function () {
  if (!formElement.checkValidity()) {
    alert("Please complete all required fields.");
    return;
  }
  const get = (id) => document.getElementById(id)?.value || "";

  const mascotAdj  = get("mascotAdj");
  const mascotAnimal = get("mascotAnimal");
  const pictureUrl = get("pictureUrl");
  const pictureCap = get("pictureCap");
  const firstName  = get("firstName");
  const middleName = get("middleName");
  const lastName   = get("lastName");
  const personalStatement = get("personalStatement");
  const quote      = get("quote");
  const quoteAuthor= get("quoteAuthor");
  const divider    = get("divider") || "~";

  // collect 7 bullets if present
  const bullets = ["b1","b2","b3","b4","b5","b6","b7"]
    .map(id => get(id))
    .filter(Boolean);

  // collect links if present
  const links = ["link1","link2","link3","link4","link5"]
    .map(id => get(id))
    .filter(Boolean);

  // collect courses
  const courseItems = Array.from(coursesList.querySelectorAll("li")).map((li) => {
    const q = (sel) => li.querySelector(sel)?.value || "";
    return `${q('input[name="course_dept"]')} ${q('input[name="course_num"]')} — ${q('input[name="course_name"]')} :: ${q('input[name="course_reason"]')}`;
  });

  // uploaded image overrides URL
  const picFile = document.getElementById("pictureFile")?.files?.[0] || null;
  let finalImgSrc = pictureUrl;
  if (picFile) finalImgSrc = URL.createObjectURL(picFile);

  // build simple output
  result.innerHTML = `
    <h2>${mascotAdj} ${mascotAnimal}</h2>
    <figure>
      <img src="${finalImgSrc}" alt="${firstName} ${lastName}" style="max-width:220px;">
      <figcaption>${pictureCap}</figcaption>
    </figure>
    <h3>${[firstName, middleName, lastName].filter(Boolean).join(" ")}</h3>
    <p>${personalStatement}</p>

    ${bullets.length ? `<ul>${bullets.map(b=>`<li>${b}</li>`).join("")}</ul>` : ""}

    ${courseItems.length ? `<h4>Current Courses</h4><ul>${courseItems.map(c=>`<li>${c}</li>`).join("")}</ul>` : ""}

    <blockquote>“${quote}” — ${quoteAuthor}</blockquote>

    ${links.length ? `<h4>Links</h4><ul>${links.map((u,i)=>`<li><a href="${u}" target="_blank" rel="noopener">Link ${i+1}</a></li>`).join("")}</ul>` : ""}

    <hr>
    <p>${divider.repeat(30)}</p>
  `;

  formElement.style.display = "none";
  result.classList.remove("hidden");
  restartLink.classList.remove("hidden");
});

/* Reset: rely on browser reset + remove any added courses */
resetBtn.addEventListener("click", function () {
  setTimeout(() => { coursesList.innerHTML = ""; }, 0);
});

/* Start over: show form again */
restartLink.addEventListener("click", function (e) {
  e.preventDefault();
  result.innerHTML = "";
  result.classList.add("hidden");
  restartLink.classList.add("hidden");
  formElement.style.display = "";
  formElement.reset();
  coursesList.innerHTML = "";
});