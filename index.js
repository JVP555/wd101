dobInput.min = minDate.toISOString().split("T")[0];
dobInput.max = maxDate.toISOString().split("T")[0];

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

form.addEventListener("submit", function (event) {
const selectedDate = new Date(dobInput.value);
if (selectedDate < minDate || selectedDate > maxDate) {
event.preventDefault();
if (selectedDate > maxDate) {
dobInput.setCustomValidity(
          "The date must be " +
            maxDate.toISOString().split("T")[0].split("-").reverse().join("/") +
            " or earlier."
          "The date must be " + formatDate(maxDate) + " or earlier."
);
} else {
dobInput.setCustomValidity(
          "The date must be " +
            minDate.toISOString().split("T")[0].split("-").reverse().join("/") +
            " or later."
          "The date must be " + formatDate(minDate) + " or later."
);
}
} else {
@@ -71,31 +75,34 @@
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

document.getElementById("user-form").addEventListener("submit", saveUserForm);
displayEntries();
