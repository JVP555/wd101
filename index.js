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

  // Extended email validation (HTML5 handles @ check)
  emailInput.addEventListener("input", () => {
    const value = emailInput.value;

    const invalidCases = [
      { regex: /@.*@/, message: "Only one '@' is allowed." },
      { regex: /\.\./, message: "Consecutive dots are not allowed." },
      { regex: /^\.|\.@|@\.|\.$/, message: "Invalid dot placement." },
      { regex: /@.*-/, message: "Hyphen not allowed at start or end of domain." },
      { regex: /@.*_/, message: "Underscore is not allowed in domain names." },
      { regex: /@[a-z0-9-]+\.[a-z]{1}$/, message: "TLD must be at least 2 characters." }
    ];

    let errorMessage = "";

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) {
      errorMessage = "Invalid format. Use lowercase only.";
    } else {
      for (const { regex, message } of invalidCases) {
        if (regex.test(value)) {
          errorMessage = message;
          break;
        }
      }
    }

    emailInput.setCustomValidity(errorMessage);
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
