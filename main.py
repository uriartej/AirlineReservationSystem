from reservation_system import ReservationSystem
import sqlite3


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
