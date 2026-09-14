from flask import Flask, jsonify, request, send_from_directory
import pyodbc
from werkzeug.security import generate_password_hash, check_password_hash
app = Flask(__name__, static_folder=".", static_url_path="")

def get_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-PK-ICT;'
        'DATABASE=MalindiLawCourt;'
        'Trusted_Connection=yes;'
    )

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(".", filename)

@app.route("/api/causelist")
def get_causelist():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT cl.HearingDate, cl.HearingTime, c.CaseNumber, c.CaseTitle,
               cl.CourtRoom, cl.MatterType, cl.Status
        FROM CauseLists cl
        JOIN Cases c ON cl.CaseID = c.CaseID
        ORDER BY cl.HearingDate, cl.HearingTime
    """)
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "date": str(row.HearingDate),
            "time": str(row.HearingTime),
            "caseNumber": row.CaseNumber,
            "caseTitle": row.CaseTitle,
            "courtRoom": row.CourtRoom,
            "type": row.MatterType,
            "status": row.Status
        })
    conn.close()
    return jsonify(result)

@app.route("/api/cases")
def search_cases():
    query = request.args.get("query", "").strip()
    conn = get_connection()
    cursor = conn.cursor()
    if query:
        cursor.execute("""
            SELECT CaseNumber, CaseTitle, CaseType, FilingDate, Status, CourtRoom
            FROM Cases
            WHERE CaseNumber LIKE ? OR CaseTitle LIKE ?
        """, f"%{query}%", f"%{query}%")
    else:
        cursor.execute("""
            SELECT CaseNumber, CaseTitle, CaseType, FilingDate, Status, CourtRoom
            FROM Cases
        """)
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "caseNumber": row.CaseNumber,
            "caseTitle": row.CaseTitle,
            "caseType": row.CaseType,
            "filingDate": str(row.FilingDate),
            "status": row.Status,
            "courtRoom": row.CourtRoom
        })
    conn.close()
    return jsonify(result)

@app.route("/api/notices")
def get_notices():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT Title, Content, NoticeDate, Category
        FROM Notices
        ORDER BY NoticeDate DESC
    """)
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "title": row.Title,
            "content": row.Content,
            "date": str(row.NoticeDate),
            "category": row.Category
        })
    conn.close()
    return jsonify(result)

@app.route("/api/contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    full_name = data.get("fullName")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    if not all([full_name, email, subject, message]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO ContactMessages (FullName, Email, Subject, Message)
        VALUES (?, ?, ?, ?)
    """, full_name, email, subject, message)
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Message sent successfully"})




@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "error": "Username and password required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT UserID, FullName, Username, PasswordHash, Role
        FROM Users
        WHERE Username = ?
    """, username)
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user.PasswordHash, password):
        return jsonify({
            "success": True,
            "fullName": user.FullName,
            "role": user.Role
        })
    else:
        return jsonify({"success": False, "error": "Invalid username or password"}), 401


if __name__ == "__main__":
    app.run(debug=True, port=5000)