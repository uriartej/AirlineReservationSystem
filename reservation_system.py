import sqlite3

class ReservationSystem:

    def __init__(self, conn):
        self.conn = conn

    # Flight methods
    def create_flight(self, flight_number, source, destination, capacity, price):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO flights (flight_number, source, destination, capacity, available_seats, price) VALUES (?, ?, ?, ?, ?, ?)",
                       (flight_number, source, destination, capacity, capacity, price))
        flight_id = cursor.lastrowid
        self.conn.commit()
        return flight_id

    def get_available_flights(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM flights WHERE available_seats > 0")
        return cursor.fetchall()

    # Passenger methods
    def create_passenger(self, name):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO passengers (name) VALUES (?)", (name,))
        passenger_id = cursor.lastrowid
        self.conn.commit()
        return passenger_id

    def get_passenger_id(self, passenger_name):
        cursor = self.conn.cursor()
        cursor.execute("SELECT id FROM passengers WHERE name=?", (passenger_name,))
        passenger = cursor.fetchone()
        return passenger[0] if passenger else None

    # Seat reservation methods
    def reserve_seat(self, passenger_id, flight_id):
        cursor = self.conn.cursor()
        cursor.execute("UPDATE flights SET available_seats = available_seats - 1 WHERE id = ? AND available_seats > 0", (flight_id,))
        if cursor.rowcount == 0:
            return False  # Reservation failed due to no available seats

        cursor.execute("INSERT INTO reservations (passenger_id, flight_id) VALUES (?, ?)", (passenger_id, flight_id))
        self.conn.commit()
        return True

    # Food item methods
    def create_food_item(self, name, price):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO food_items (name, price) VALUES (?, ?)", (name, price))
        item_id = cursor.lastrowid
        self.conn.commit()
        return item_id

    def list_food_items(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM food_items")
        return cursor.fetchall()

    # Streaming service methods
    def create_streaming_service(self, name, price):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO streaming_services (name, price) VALUES (?, ?)", (name, price))
        service_id = cursor.lastrowid
        self.conn.commit()
        return service_id

    def list_streaming_services(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM streaming_services")
        return cursor.fetchall()

    # Seat type methods
    def create_seat_type(self, type, price_multiplier):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO seat_types (type, price_multiplier) VALUES (?, ?)", (type, price_multiplier))
        seat_type_id = cursor.lastrowid
        self.conn.commit()
        return seat_type_id

    def list_seat_types(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM seat_types")
        return cursor.fetchall()

