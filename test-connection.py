import pyodbc
conn=pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-PK-ICT;'
    'DATABASE=MalindiLawCourt;'
    'Trusted_Connection=yes;'
)
cursor=conn.cursor()
cursor.execute("SELECT name FROM sys.tables")

print("connected successfully! Tables found:")
for row in cursor:
    print("_", row.name)
conn.close()