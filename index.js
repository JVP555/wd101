document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const form = document.getElementById("user-form");

  const today = new Date();
  const minAge = 18;
  const maxAge = 55;

  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());

  dobInput.min = minDate.toISOString().split("T")[0];
  dobInput.max = maxDate.toISOString().split("T")[0];

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const validateEmail = (emailInput) => {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!re.test(emailInput.value)) {
      emailInput.setCustomValidity("Please enter a valid lowercase email address.");
    } else {
      emailInput.setCustomValidity("");
    }
  };

  const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const emailInput = document.getElementById("email");
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptedTerms = document.getElementById("terms").checked;

    // Email validation
    validateEmail(emailInput);

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return; 
    }

    // Clear lingering validation message before saving
    emailInput.setCustomValidity("");

    // DOB validation
    const selectedDate = new Date(dob);
    if (selectedDate < minDate || selectedDate > maxDate) {
      dobInput.setCustomValidity(`Date of birth must be between ${formatDate(minDate)} and ${formatDate(maxDate)}.`);
      dobInput.reportValidity();
      return;
    } else {
      dobInput.setCustomValidity("");
    }

    // Store entry in localStorage
    const entry = { name, email: emailInput.value, password, dob, acceptedTerms };
    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));

    displayEntries();
    form.reset();
  };

  form.addEventListener("submit", saveUserForm);
  displayEntries();
});
