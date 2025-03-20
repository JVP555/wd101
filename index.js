document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const form = document.getElementById("user-form");

  const today = new Date();
  const minAge = 18;
  const maxAge = 55;

  const maxDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );
  const minDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate()
  );

  dobInput.min = minDate.toISOString().split("T")[0];
  dobInput.max = maxDate.toISOString().split("T")[0];

  // Format date to yyyy/mm/dd
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  form.addEventListener("submit", function (event) {
    const selectedDate = new Date(dobInput.value);
    
    if (selectedDate < minDate || selectedDate > maxDate || isNaN(selectedDate)) {
      event.preventDefault();
      
      if (selectedDate > maxDate) {
        dobInput.setCustomValidity(
          `The date must be ${formatDate(maxDate)} or earlier.`
        );
      } else if (selectedDate < minDate) {
        dobInput.setCustomValidity(
          `The date must be ${formatDate(minDate)} or later.`
        );
      } else {
        dobInput.setCustomValidity("Invalid date format. Use yyyy/mm/dd.");
      }
    } else {
      dobInput.setCustomValidity("");
    }
    dobInput.reportValidity();
  });
});

// Local Storage Functions
const retrieveEntries = () => {
  let entries = localStorage.getItem("user-entries");
  return entries ? JSON.parse(entries) : [];
};

let userEntries = retrieveEntries();

const displayEntries = () => {
  const entries = retrieveEntries();
  const tableRows = entries
    .map(
      (entry) => `
                <tr>
                    <td>${entry.name}</td>
                    <td>${entry.email}</td>
                    <td>${entry.password}</td>
                    <td>${entry.dob}</td>
                    <td>${entry.acceptedTerms ? "true" : "false"}</td>
                </tr>
            `
    )
    .join("\n");

  document.getElementById("entriesTable").innerHTML = tableRows;
};

const validateEmail = (email) => {
  if (email !== email.toLowerCase()) {
    return false;
  }
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return re.test(email);
};

const saveUserForm = (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const acceptedTerms = document.getElementById("terms").checked;

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const entry = { name, email, password, dob, acceptedTerms };
  userEntries.push(entry);
  localStorage.setItem("user-entries", JSON.stringify(userEntries));

  displayEntries();
  document.getElementById("user-form").reset();
};

document.getElementById("user-form").addEventListener("submit", saveUserForm
