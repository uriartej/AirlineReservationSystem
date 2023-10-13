import sqlite3
import logging

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

class ReservationSystem:
    def __init__(self, db_connection):
        self.conn = db_connection

    def _execute_query(self, query, params=()):
        try:
            with self.conn:
                cursor = self.conn.cursor()
                cursor.execute(query, params)
                cursor.close()
            return True
        except sqlite3.IntegrityError as e:
            logger.error(f"Integrity Error occurred: {e}")
        except sqlite3.Error as e:
            logger.error(f"SQLite Error occurred: {e}")
        except Exception as e:
            logger.error(f"Unexpected Error occurred: {e}")
        return False

    def _fetch_data(self, query, params=()):
        try:
            with self.conn:
                cursor = self.conn.cursor()
                cursor.execute(query, params)
                result = cursor.fetchall()
                cursor.close()
                return result
        except sqlite3.Error as e:
            logger.error(f"SQLite Error occurred: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected Error occurred: {e}")
            return []

    def create_flight(self, flight_number, source, destination, capacity):
        query = """INSERT INTO flights 
                   (flight_number, source, destination, capacity, available_seats) 
                   VALUES (?, ?, ?, ?, ?)"""
        return self._execute_query(query, (flight_number, source, destination, capacity, capacity))

    def create_passenger(self, name):
        return self._execute_query("INSERT INTO passengers (name) VALUES (?)", (name,))

    def reserve_seat(self, passenger_id, flight_id):
        row = self._fetch_data("SELECT available_seats FROM flights WHERE id=?", (flight_id,))
        if row and row[0][0] > 0:
            if self._execute_query("INSERT INTO reservations (passenger_id, flight_id) VALUES (?, ?)", (passenger_id, flight_id)):
                return self._execute_query("UPDATE flights SET available_seats = available_seats - 1 WHERE id=?", (flight_id,))
        logger.error("No available seats or Flight not found.")
        return False

    def get_available_flights(self):
        return self._fetch_data("SELECT * FROM flights WHERE available_seats > 0")


