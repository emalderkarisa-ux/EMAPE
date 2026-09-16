\# EMAPE — Malindi Law Court Management System



A Flask-based web application built for the Malindi Law Court to digitize and streamline day-to-day court operations — cause lists, case tracking, notices, and public inquiries — backed by a SQL Server database.



\## Features



\- \*\*Cause List Lookup\*\* — view scheduled hearings by date, time, courtroom, matter type, and status

\- \*\*Case Search\*\* — search cases by case number or title, with full case details (type, filing date, status, courtroom)

\- \*\*Public Notices\*\* — browse court notices and announcements by category

\- \*\*Contact Form\*\* — public inquiry submissions stored directly to the database

\- \*\*Admin Login\*\* — secure authentication using hashed passwords (Werkzeug)



\## Tech Stack



\- \*\*Backend:\*\* Python, Flask

\- \*\*Database:\*\* Microsoft SQL Server (via `pyodbc`, Windows Authentication)

\- \*\*Frontend:\*\* HTML, CSS, JavaScript

\- \*\*Security:\*\* Password hashing with `werkzeug.security`



\## Project Structure



```

EMAPE/

├── app.py              # Flask application and API routes

├── index.html           # Landing page

├── dashboard.html        # Admin dashboard

├── cause-list.html       # Cause list view

├── case-search.html       # Case search interface

├── notices.html          # Public notices

├── contact.html          # Contact/inquiry form

├── login.html            # Admin login

├── about.html            # About page

├── services.html          # Services overview

├── script.js             # Frontend logic

├── style.css             # Styling

└── media/               # Static assets

```



\## Setup



1\. Clone the repository

2\. Install dependencies:

&#x20;  ```

&#x20;  pip install flask pyodbc werkzeug

&#x20;  ```

3\. Configure your SQL Server connection in `app.py` (`get\_connection()`)

4\. Run the app:

&#x20;  ```

&#x20;  python app.py

&#x20;  ```

5\. Visit `http://localhost:5000`



\## About This Project



Built during an ICT attachment at Malindi Law Court, starting from a static multi-page HTML/CSS front end and progressively connected to a live SQL Server backend with real court data — cause lists, case records, and admin authentication.



\## License



This project was developed for internal use at Malindi Law Court. Contact the author for reuse permissions.

