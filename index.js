document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const form = document.getElementById("user-form");

  const today = new Date();
  const minAge = 18;
  const maxAge = 55;

  // Set min/max allowed dates directly on the input field
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

  // Retrieve stored entries
  const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    return entries ? JSON.parse(entries) : [];
  };

  let userEntries = retrieveEntries();

  // Display stored entries in table
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
        </tr>`
      )
      .join("\n");

    document.getElementById("entriesTable").innerHTML = tableRows;
  };

  // Validate lowercase email
  const validateEmail = (email) => {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; // lowercase only
    return re.test(email);
  };

  // Save form data
  const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptedTerms = document.getElementById("terms").checked;

    // Validate email
    if (!validateEmail(email)) {
      alert("Please enter a valid lowercase email address.");
      return;
    }

    // Age validation
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageMonthDiff = today.getMonth() - birthDate.getMonth();
    const ageDayDiff = today.getDate() - birthDate.getDate();

    if (
      age < minAge ||
      age > maxAge ||
      (age === minAge && ageMonthDiff < 0) ||
      (age === minAge && ageMonthDiff === 0 && ageDayDiff < 0)
    ) {
      alert(`Age must be between ${minAge} and ${maxAge} years.`);
      return;
    }

    const entry = { name, email, password, dob, acceptedTerms };
    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));

    displayEntries();
    form.reset();
  };

  form.addEventListener("submit", saveUserForm);
  displayEntries();
});
