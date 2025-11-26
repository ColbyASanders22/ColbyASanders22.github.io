/**
 * Hunter's Guitar Lessons - Appointments Interactivity
 * Interactivity: Upcoming Lessons sidebar + Delete functionality
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  if (!form) return;

  const feedback = document.getElementById("appointment-feedback");
  const list = document.getElementById("upcoming-appointments");
  const emptyMsg = document.getElementById("no-appointments-message");

  const STORAGE_KEY = "huntersGuitarLessonsAppointments";

  let appointments = [];

  function loadAppointments() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      appointments = [];
      renderAppointments();
      return;
    }
    try {
      appointments = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored appointments", e);
      appointments = [];
    }
    renderAppointments();
  }

  function saveAppointments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }

  function formatDateTime(date) {
    const dateOptions = { month: "short", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };
    const datePart = date.toLocaleDateString(undefined, dateOptions);
    const timePart = date.toLocaleTimeString(undefined, timeOptions);
    return `${datePart} · ${timePart}`;
  }

  function renderAppointments() {
    list.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      emptyMsg.style.display = "block";
      return;
    }

    emptyMsg.style.display = "none";

    const sortedAppointments = appointments
      .map((appt) => ({
        ...appt,
        dateObj: new Date(appt.dateTime),
      }))
      .sort((a, b) => a.dateObj - b.dateObj);

    sortedAppointments.slice(0, 5).forEach((appt) => {
      const li = document.createElement("li");
      li.classList.add("appointment-card");
      li.dataset.id = appt.id; // store appointment ID in HTML

      const header = document.createElement("div");
      header.classList.add("appointment-card-header");

      const dateSpan = document.createElement("span");
      dateSpan.classList.add("appointment-date-time");

      if (!isNaN(appt.dateObj.getTime())) {
        dateSpan.textContent = formatDateTime(appt.dateObj);
      } else {
        dateSpan.textContent = "Date/time not set";
      }

      const typeSpan = document.createElement("span");
      typeSpan.classList.add("appointment-lesson-type");
      typeSpan.textContent = appt.lessonType || "Guitar Lesson";

      header.appendChild(dateSpan);
      header.appendChild(typeSpan);

      const customerP = document.createElement("p");
      customerP.classList.add("appointment-customer");
      customerP.textContent = appt.name;

      // ✅ Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-appointment-btn");
      deleteBtn.setAttribute("aria-label", "Delete appointment");

      li.appendChild(header);
      li.appendChild(customerP);
      li.appendChild(deleteBtn);

      list.appendChild(li);
    });
  }

  // ✅ Delete appointment when clicking delete button
  list.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-appointment-btn")) return;

    const li = e.target.closest("li");
    const idToDelete = Number(li.dataset.id);

    appointments = appointments.filter((appt) => appt.id !== idToDelete);

    saveAppointments();
    renderAppointments();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("customer-name");
    const emailInput = document.getElementById("customer-email");
    const lessonTypeSelect = document.getElementById("lesson-type");
    const dateInput = document.getElementById("appointment-date");
    const timeInput = document.getElementById("appointment-time");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const lessonType = lessonTypeSelect.value || "Guitar Lesson";
    const date = dateInput.value;
    const time = timeInput.value;

    if (!name || !email || !date || !time) {
      feedback.textContent = "Please fill out all required fields.";
      feedback.style.color = "red";
      return;
    }

    const dateTimeString = `${date}T${time}`;
    const dateObj = new Date(dateTimeString);

    if (isNaN(dateObj.getTime())) {
      feedback.textContent = "Please choose a valid date and time.";
      feedback.style.color = "red";
      return;
    }

    const newAppointment = {
      id: Date.now(),
      name,
      email,
      lessonType,
      dateTime: dateObj.toISOString(),
    };

    appointments.push(newAppointment);
    saveAppointments();
    renderAppointments();

    form.reset();
    feedback.textContent = "Thanks! Your lesson has been added to the schedule.";
    feedback.style.color = "green";
  });

  loadAppointments();
});
