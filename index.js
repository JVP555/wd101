document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const dobError = document.getElementById("dob-error");

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

  dobInput.addEventListener("change", function () {
    const selectedDate = new Date(dobInput.value);
    if (selectedDate < minDate || selectedDate > maxDate) {
      dobError.textContent = "Age must be between 18 and 55 years.";
      dobInput.setCustomValidity("Invalid age");
    } else {
      dobError.textContent = "";
      dobInput.setCustomValidity("");
    }
  });
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
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const acceptedTerms = document.getElementById("terms").checked;

  const entry = { name, email, password, dob, acceptedTerms };
  userEntries.push(entry);
  localStorage.setItem("user-entries", JSON.stringify(userEntries));

  displayEntries();
  document.getElementById("user-form").reset();
};

document.getElementById("user-form").addEventListener("submit", saveUserForm);
displayEntries();

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});

