/* =========================
   MOBILE MENU
========================= */

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {

    menuButton.addEventListener("click", function () {

        navigation.classList.toggle("show");

    });


    const links = navigation.querySelectorAll("a");

    links.forEach(function(link) {

        link.addEventListener("click", function() {

            navigation.classList.remove("show");

        });

    });

}


/* =========================
   VIDEO
========================= */

const heroVideo = document.querySelector(".hero-video");

if (heroVideo) {

    heroVideo.play().catch(function() {

        console.log("Video autoplay requires muted playback.");

    });

}


/* =========================
   CASE SEARCH
========================= */

function searchCase() {

  const input = document.getElementById("caseInput");
  const result = document.getElementById("searchResult");

  if (!input || !result) {
    return;
  }

  const searchValue = input.value.trim();

  if (searchValue === "") {
    result.innerHTML = `
      <h3>Search Results</h3>
      <p>Please enter a case number or keyword.</p>
    `;
    return;
  }

  result.innerHTML = `<h3>Search Results</h3><p>Searching...</p>`;

  fetch("/api/cases?query=" + encodeURIComponent(searchValue))
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        result.innerHTML = `
          <h3>Search Results</h3>
          <p>No cases found matching "${searchValue}".</p>
        `;
        return;
      }

      let html = `<h3>Search Results</h3>`;
      data.forEach(item => {
        html += `
          <div class="search-result-card">
            <p><strong>Case Number:</strong> ${item.caseNumber}</p>
            <p><strong>Title:</strong> ${item.caseTitle}</p>
            <p><strong>Type:</strong> ${item.caseType}</p>
            <p><strong>Filing Date:</strong> ${item.filingDate}</p>
            <p><strong>Status:</strong> ${item.status}</p>
            <p><strong>Court Room:</strong> ${item.courtRoom}</p>
          </div>
        `;
      });
      result.innerHTML = html;
    })
    .catch(error => {
      console.error("Error searching cases:", error);
      result.innerHTML = `<h3>Search Results</h3><p>Something went wrong. Please try again.</p>`;
    });
} 



/* =========================
   CAUSE LIST FILTER
========================= */

const causeSearch = document.getElementById("causeSearch");
const dateFilter = document.getElementById("dateFilter");
const courtFilter = document.getElementById("courtFilter");
const causeTable = document.getElementById("causeTable");


function filterCauseList() {

    if (!causeTable) {
        return;
    }

    const rows = causeTable
        .querySelector("tbody")
        .querySelectorAll("tr");

    const searchText =
        causeSearch ?
        causeSearch.value.toLowerCase() :
        "";

    const selectedDate =
        dateFilter ?
        dateFilter.value :
        "";

    const selectedCourt =
        courtFilter ?
        courtFilter.value :
        "";


    rows.forEach(function(row) {

        const rowText = row.innerText.toLowerCase();

        const rowDate = row.cells[0].innerText;
        const rowCourt = row.cells[3].innerText;


        const matchesSearch =
            rowText.includes(searchText);

        const matchesDate =
            selectedDate === "" ||
            rowDate === selectedDate;

        const matchesCourt =
            selectedCourt === "" ||
            rowCourt === selectedCourt;


        if (
            matchesSearch &&
            matchesDate &&
            matchesCourt
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


if (causeSearch) {
    causeSearch.addEventListener(
        "input",
        filterCauseList
    );
}

if (dateFilter) {
    dateFilter.addEventListener(
        "change",
        filterCauseList
    );
}

if (courtFilter) {
    courtFilter.addEventListener(
        "change",
        filterCauseList
    );
}


/* =========================
   NOTICE SEARCH
========================= */

const noticeSearch =
    document.getElementById("noticeSearch");


if (noticeSearch) {

    noticeSearch.addEventListener(
        "input",
        function() {

            const value =
                noticeSearch.value.toLowerCase();

            const notices =
                document.querySelectorAll(".notice-card");


            notices.forEach(function(notice) {

                const text =
                    notice.innerText.toLowerCase();

                if (text.includes(value)) {

                    notice.style.display = "grid";

                } else {

                    notice.style.display = "none";

                }

            });

        }
    );

}


/* =========================
   CONTACT FORM
========================= */



/* =========================
   ADMIN LOGIN
========================= */

function adminLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;


    /*
       DEMONSTRATION ONLY.

       This is NOT a secure authentication system.
       Real authentication should use a backend/database.
    */

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        window.location.href = "dashboard.html";

    } else {

        alert(
            "Invalid demonstration login.\n\n" +
            "Username: admin\n" +
            "Password: admin123"
        );

    }

}













// ---------- Load real Cause List data from Flask/SQL Server ----------
document.addEventListener("DOMContentLoaded", function () {
  const causeTableBody = document.getElementById("causeTableBody");
  if (!causeTableBody) return; // only run this on cause-list.html

  fetch("/api/causelist")
    .then(response => response.json())
    .then(data => {
      causeTableBody.innerHTML = ""; // clear anything existing

      data.forEach(item => {
        const statusClass = item.status.toLowerCase() === "scheduled" ? "pending" : "complete";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.date}</td>
          <td>${item.time}</td>
          <td>${item.caseTitle}</td>
          <td>${item.courtRoom}</td>
          <td>${item.type}</td>
          <td><span class="status ${statusClass}">${item.status}</span></td>
        `;
        causeTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error loading cause list:", error);
      causeTableBody.innerHTML = "<tr><td colspan='6'>Could not load cause list.</td></tr>";
    });
}); 










// ---------- Load real Notices data from Flask/SQL Server ----------
document.addEventListener("DOMContentLoaded", function () {
  const noticeList = document.getElementById("noticeList");
  if (!noticeList) return; // only run this on notices.html

  fetch("/api/notices")
    .then(response => response.json())
    .then(data => {
      noticeList.innerHTML = "";

      if (data.length === 0) {
        noticeList.innerHTML = "<p>No notices available at this time.</p>";
        return;
      }

      data.forEach(item => {
        const dateParts = item.date.split("-");
        const day = dateParts[2];
        const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
        const month = monthNames[parseInt(dateParts[1], 10) - 1];
        const year = dateParts[0];

        const article = document.createElement("article");
        article.className = "notice-card";
        article.innerHTML = `
          <div class="notice-date">
            <strong>${day}</strong>
            <span>${month} ${year}</span>
          </div>
          <div>
            <span class="notice-category">${item.category.toUpperCase()}</span>
            <h3>${item.title}</h3>
            <p>${item.content}</p>
          </div>
        `;
        noticeList.appendChild(article);
      });
    })
    .catch(error => {
      console.error("Error loading notices:", error);
      noticeList.innerHTML = "<p>Could not load notices.</p>";
    });
}); 












// ---------- Contact Form Submission ----------
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return; // only run this on contact.html

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!fullName || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, subject, message })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Message sent successfully. Thank you for contacting us.");
          contactForm.reset();
        } else {
          alert("Something went wrong: " + (data.error || "Please try again."));
        }
      })
      .catch(error => {
        console.error("Error sending message:", error);
        alert("Could not send message. Please try again later.");
      });
  });
}); 