from reservation_system import ReservationSystem
import sqlite3

def input_positive_int(prompt):
    while True:
        try:
            value = int(input(prompt))
            if value <= 0:
                raise ValueError("Please enter a positive integer.")
            return value
        except ValueError as e:
            print(e)

def input_positive_float(prompt):
    while True:
        try:
            value = float(input(prompt))
            if value <= 0:
                raise ValueError("Please enter a positive number.")
            return value
        except ValueError as e:
            print(e)

def create_flight(system):
    flight_number = input("Flight Number: ")
    source = input("Source: ")
    destination = input("Destination: ")
    capacity = input_positive_int("Capacity: ")
    
    if system.create_flight(flight_number, source, destination, capacity):
        print("Flight created successfully.")
    else:
        print("Failed to create flight.")

def create_passenger(system):
    name = input("Passenger Name: ")
    
    if system.create_passenger(name):
        print("Passenger added successfully.")
    else:
        print("Failed to add passenger.")

def reserve_seat(system):
    passenger_name = input("Passenger Name: ")
    flight_id = input_positive_int("Flight ID: ")
    
    passenger_id = system.get_passenger_id(passenger_name)
    if passenger_id is None:
        print("Passenger not found.")
        return
    
    if system.reserve_seat(passenger_id, flight_id):
        print("Seat reserved successfully.")
    else:
        print("Seat reservation failed (no available seats or flight not found).")

def create_food_item(system):
    name = input("Food Item Name: ")
    price = input_positive_float("Price: ")
    
    if system.create_food_item(name, price):
        print("Food item added successfully.")
    else:
        print("Failed to add food item.")

def create_streaming_service(system):
    name = input("Streaming Service Name: ")
    price = input_positive_float("Price: ")
    
    if system.create_streaming_service(name, price):
        print("Streaming service added successfully.")
    else:
        print("Failed to add streaming service.")

def create_seat_type(system):
    type = input("Seat Type: ")
    price_multiplier = input_positive_float("Price Multiplier: ")
    
    if system.create_seat_type(type, price_multiplier):
        print("Seat type added successfully.")
    else:
        print("Failed to add seat type.")

def list_food_items(system):
    for item in system.list_food_items():
        print(f"ID: {item[0]}, Name: {item[1]}, Price: ${item[2]}")

def list_streaming_services(system):
    for service in system.list_streaming_services():
        print(f"ID: {service[0]}, Name: {service[1]}, Price: ${service[2]}")

def list_seat_types(system):
    for type in system.list_seat_types():
        print(f"ID: {type[0]}, Type: {type[1]}, Price Multiplier: x{type[2]}")

def main(system):
    while True:
        print("\nAirline Reservation Menu")
        print("1. Create Flight")
        print("2. Create Passenger")
        print("3. Reserve Seat")
        print("4. List Available Flights")
        print("5. Create Food Item")
        print("6. Create Streaming Service")
        print("7. Create Seat Type")
        print("8. List Food Items")
        print("9. List Streaming Services")
        print("10. List Seat Types")
        print("0. Exit")

        try:
            choice = int(input("\nEnter your choice: "))
        except ValueError:
            print("Please enter a valid number.")
            continue

        if choice == 1:
            create_flight(system)
        elif choice == 2:
            create_passenger(system)
        elif choice == 3:
            reserve_seat(system)
        elif choice == 4:
            list_available_flights(system)
        elif choice == 5:
            create_food_item(system)
        elif choice == 6:
            create_streaming_service(system)
        elif choice == 7:
            create_seat_type(system)
        elif choice == 8:
            list_food_items(system)
        elif choice == 9:
            list_streaming_services(system)
        elif choice == 10:
            list_seat_types(system)
        elif choice == 0:
            print("Exiting the system. Goodbye!")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    try:
        conn = sqlite3.connect("airline_reservation.db")
        system = ReservationSystem(conn)
        main(system)
    except sqlite3.Error as e:
        print(f"Failed to connect to the database: {e}")
    finally:
        conn.close()
