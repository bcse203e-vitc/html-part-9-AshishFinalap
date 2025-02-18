
const serviceButtons = document.querySelectorAll(".service-btn");
const formPopup = document.getElementById("form-popup");
const closeButtons = document.querySelectorAll(".close-btn");
const appointmentForm = document.getElementById("appointment-form");
const appointmentsTable = document.getElementById("appointments-table").getElementsByTagName("tbody")[0];
const confirmationPopup = document.getElementById("confirmation-popup");
const confirmationMessage = document.getElementById("confirmation-message");

serviceButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("service").value = button.getAttribute("data-service");
    formPopup.style.display = "flex";
  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", () => {
    formPopup.style.display = "none";
    confirmationPopup.style.display = "none";
  });
});

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dateTime = document.getElementById("date-time").value;
  const terms = document.getElementById("terms").checked;

  let isValid = true;

  if (!name) {
    document.getElementById("name-error").textContent = "Name is required.";
    document.getElementById("name-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("name-error").style.display = "none";
  }

  if (!email.includes("@")) {
    document.getElementById("email-error").textContent = "Invalid email format.";
    document.getElementById("email-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("email-error").style.display = "none";
  }

  if (phone.length !== 10 || isNaN(phone)) {
    document.getElementById("phone-error").textContent = "Phone number must be 10 digits.";
    document.getElementById("phone-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("phone-error").style.display = "none";
  }

  if (new Date(dateTime) < new Date()) {
    document.getElementById("date-error").textContent = "Date must be in the future.";
    document.getElementById("date-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("date-error").style.display = "none";
  }

  if (!terms) {
    document.getElementById("terms-error").textContent = "You must agree to the terms.";
    document.getElementById("terms-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("terms-error").style.display = "none";
  }

  if (isValid) {

    const appointment = {
      name,
      email,
      phone,
      service: document.getElementById("service").value,
      dateTime,
      status: "Pending"
    };

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    confirmationMessage.textContent = `Thank you, ${name}! Your appointment for ${appointment.service} on ${new Date(dateTime).toLocaleString()} is confirmed.`;
    confirmationPopup.style.display = "flex";

    appointmentForm.reset();
    formPopup.style.display = "none";

    loadAppointments();
  }
});

function loadAppointments() {
  appointmentsTable.innerHTML = "";
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments.forEach((appointment, index) => {
    const row = appointmentsTable.insertRow();
    row.innerHTML = `
      <td>${appointment.name}</td>
      <td>${appointment.service}</td>
      <td>${new Date(appointment.dateTime).toLocaleString()}</td>
      <td>${appointment.status}</td>
      <td>
        <button onclick="cancelAppointment(${index})">Cancel</button>
      </td>
    `;
  });
}

function cancelAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments"));
  appointments.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  loadAppointments();
}

loadAppointments();
