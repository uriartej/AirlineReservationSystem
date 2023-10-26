import sqlite3

# Establish a database connection and create a cursor for executing commands
conn = sqlite3.connect("airline_reservation.db")

# Enable foreign key support explicitly in SQLite
conn.execute("PRAGMA foreign_keys = ON")

cursor = conn.cursor()

# Creating a table for flights
# Includes flight details like flight number, source, destination, and seating details
cursor.execute('''
    CREATE TABLE IF NOT EXISTS flights (
        id INTEGER PRIMARY KEY,
        flight_number TEXT NOT NULL,
        source TEXT,
        destination TEXT,
        capacity INTEGER,
        available_seats INTEGER,
        price REAL NOT NULL
    )
''')

# Creating a table for passengers
# Holds the name of passengers
cursor.execute('''
    CREATE TABLE IF NOT EXISTS passengers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )
''')

# Creating a table for reservations
# Links passengers with flights they have booked
cursor.execute('''
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY,
        passenger_id INTEGER REFERENCES passengers(id) NOT NULL,
        flight_id INTEGER REFERENCES flights(id)
    )
''')

# Creating a table for food items
# Lists various food items that passengers can purchase
cursor.execute('''
    CREATE TABLE IF NOT EXISTS food_items (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL
    )
''')

# Creating a table for streaming services
# Lists various streaming services passengers can purchase
cursor.execute('''
    CREATE TABLE IF NOT EXISTS streaming_services (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL
    )
''')

# Creating a table for different types of seats
# Lists seat types and their price multipliers
cursor.execute('''
    CREATE TABLE IF NOT EXISTS seat_types (
        id INTEGER PRIMARY KEY,
        type TEXT,
        price_multiplier REAL
    )
''')

# Commit the transactions to the database
conn.commit()

# Close the cursor and connection to the database
cursor.close()
conn.close()
