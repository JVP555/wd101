document.addEventListener("DOMContentLoaded", function () {
     const form = document.getElementById("user-form");
     const dobInput = document.getElementById("dob");
 
     const today = new Date();
     const minAge = 18;
     const maxAge = 55;
 
     const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
     const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
 
     dobInput.min = minDate.toISOString().split("T")[0];
     dobInput.max = maxDate.toISOString().split("T")[0];
 
     form.addEventListener("submit", function (event) {
         const selectedDate = new Date(dobInput.value);
         if (selectedDate > maxDate || selectedDate < minDate) {
             event.preventDefault();
             dobInput.setCustomValidity(`Date of birth must be between ${minDate.getFullYear()} and ${maxDate.getFullYear()}.`);
         } else {
             dobInput.setCustomValidity("");
         }
         dobInput.reportValidity();
     });
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
 
   form.addEventListener("submit", function (event) {
     const selectedDate = new Date(dobInput.value);
     if (selectedDate < minDate || selectedDate > maxDate) {
       event.preventDefault();
       if (selectedDate > maxDate) {
         dobInput.setCustomValidity(
           "The date must be " +
             maxDate.toISOString().split("T")[0].split("-").reverse().join("/") +
             " or earlier."
         );
       } else {
         dobInput.setCustomValidity(
           "The date must be " +
             minDate.toISOString().split("T")[0].split("-").reverse().join("/") +
             " or later."
         );
       }
     } else {
       dobInput.setCustomValidity("");
     }
     dobInput.reportValidity();
   });
 });
 
 const retrieveEntries = () => {
     let entries = localStorage.getItem("user-entries");
     return entries ? JSON.parse(entries) : [];
   let entries = localStorage.getItem("user-entries");
   return entries ? JSON.parse(entries) : [];
 };
 
 let userEntries = retrieveEntries();
 
 const displayEntries = () => {
     const entries = retrieveEntries();
     const tableRows = entries.map((entry) => `
         <tr>
             <td>${entry.name}</td>
             <td>${entry.email}</td>
             <td>${entry.password}</td>
             <td>${entry.dob}</td>
             <td>${entry.acceptedTerms ? "Yes" : "No"}</td>
         </tr>
     `).join("\n");
 
     document.getElementById("entriesTable").innerHTML = tableRows;
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
     const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
     return re.test(email);
   const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   return re.test(email);
 };
 
 const saveUserForm = (event) => {
     event.preventDefault();
   event.preventDefault();
 
     const name = document.getElementById("name").value.trim();
     const email = document.getElementById("email").value.trim();
     const password = document.getElementById("password").value;
     const dob = document.getElementById("dob").value;
     const acceptedTerms = document.getElementById("terms").checked;
   const name = document.getElementById("name").value.trim();
   const email = document.getElementById("email").value.trim();
   const password = document.getElementById("password").value;
   const dob = document.getElementById("dob").value;
   const acceptedTerms = document.getElementById("terms").checked;
 
     if (!validateEmail(email)) {
         document.getElementById("email").setCustomValidity("Invalid email format. Example: user@example.com");
         document.getElementById("email").reportValidity();
         return;
     } else {
         document.getElementById("email").setCustomValidity("");
     }
 
     const selectedDate = new Date(dob);
     const today = new Date();
     const minAge = 18;
     const maxAge = 55;
     const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
     const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
 
     if (selectedDate > maxDate || selectedDate < minDate) {
         dobInput.setCustomValidity(`Date of birth must be between ${minDate.getFullYear()} and ${maxDate.getFullYear()}.`);
         dobInput.reportValidity();
         return;
     } else {
         dobInput.setCustomValidity("");
     }
   if (!validateEmail(email)) {
     alert("Please enter a valid email address.");
     return;
   }
 
     const entry = { name, email, password, dob, acceptedTerms };
     userEntries.push(entry);
     localStorage.setItem("user-entries", JSON.stringify(userEntries));
   const entry = { name, email, password, dob, acceptedTerms };
   userEntries.push(entry);
   localStorage.setItem("user-entries", JSON.stringify(userEntries));
 
     displayEntries();
     form.reset();
   displayEntries();
   document.getElementById("user-form").reset();
 };
 
 document.getElementById("user-form").addEventListener("submit", saveUserForm);
 displayEntries();
