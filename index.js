document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("user-form");
  const dobInput = document.getElementById("dob");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const termsInput = document.getElementById("terms");

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

  // Correct email validation
  emailInput.addEventListener("input", () => {
    const email = emailInput.value;

    const strictEmailRegex =
      /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

    const domainPart = email.split("@")[1];
    const domainValid = domainPart
      ? domainPart
          .split(".")
          .every(
            (label) =>
              /^[a-z0-9-]+$/.test(label) &&
              !/^[-]|[-]$/.test(label) &&
              !label.includes("_")
          )
      : false;

    // If email is invalid
    if (!strictEmailRegex.test(email) || !domainValid) {
      emailInput.setCustomValidity(
        "Invalid email format. Use lowercase letters only and avoid symbols like '__', '..', or domain errors."
      );
    } else {
      // Clear custom validity if email is valid
      emailInput.setCustomValidity("");
    }
  });

  // Age validation using setCustomValidity
  dobInput.addEventListener("input", () => {
    const birthDate = new Date(dobInput.value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageMonthDiff = today.getMonth() - birthDate.getMonth();
    const ageDayDiff = today.getDate() - birthDate.getDate();

    if (
      age < minAge ||
      age > maxAge ||
      (age === minAge && ageMonthDiff < 0) ||
      (age === minAge && ageMonthDiff === 0 && ageDayDiff < 0)
    ) {
      dobInput.setCustomValidity(
        `Age must be between ${minAge} and ${maxAge} years.`
      );
    } else {
      dobInput.setCustomValidity("");
    }
  });

  // Terms validation
  termsInput.addEventListener("change", () => {
    if (!termsInput.checked) {
      termsInput.setCustomValidity("You must accept the terms and conditions.");
    } else {
      termsInput.setCustomValidity("");
    }
  });

  // Save form data
  const saveUserForm = (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const entry = {
      name: document.getElementById("name").value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      dob: dobInput.value,
      acceptedTerms: termsInput.checked,
    };

    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));

    displayEntries();
    form.reset();
  };

  form.addEventListener("submit", saveUserForm);
  displayEntries();
});
