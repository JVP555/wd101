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

  dobInput.addEventListener("submit", function () {
    const selectedDate = new Date(dobInput.value);
    if (selectedDate < minDate || selectedDate > maxDate) {
      if (selectedDate > maxDate) {
        dobInput.setCustomValidity(
          "The value must be atleast " +
            maxDate.toISOString().split("T")[0].split("-")[2] +
            "/" +
            maxDate.toISOString().split("T")[0].split("-")[1] +
            "/" +
            maxDate.toISOString().split("T")[0].split("-")[0] +
            " or earlier."
        );
      } else {
        dobInput.setCustomValidity(
          "The value must be atleast " +
            minDate.toISOString().split("T")[0].split("-")[2] +
            "/" +
            minDate.toISOString().split("T")[0].split("-")[1] +
            "/" +
            minDate.toISOString().split("T")[0].split("-")[0] +
            " or later."
        );
      }
    } else {
      dobInput.setCustomValidity("");
    }
    dobInput.reportValidity(); // Shows pop-up validation
  });

  const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    return entries ? JSON.parse(entries) : [];
  };

  let userEntries = retrieveEntries();

  const displayEntries = () => {
    const entries = retrieveEntries();
    const tableRows = entries
      .map((entry) => {
        return `
                <tr>
                    <td>${entry.name}</td>
                    <td>${entry.email}</td>
                    <td>${entry.password}</td>
                    <td>${entry.dob}</td>
                    <td>${entry.acceptedTerms ? "true" : "false"}</td>
                </tr>
            `;
      })
      .join("\n");

    document.getElementById("entriesTable").innerHTML = tableRows;
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
    form.reset();
  };
  form.addEventListener("submit", saveUserForm);
  displayEntries();
});
