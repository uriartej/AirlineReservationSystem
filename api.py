from flask import Flask, jsonify, request, abort, g
from flask_cors import CORS
from reservation_system import ReservationSystem
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Allows CORS for all routes

DATABASE = "airline_reservation.db"

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE, check_same_thread=False)
    return g.db

@app.teardown_appcontext
def close_db(e = None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


@app.route('/')
def home():
    return "Flight it Your Way"


@app.route('/create_flight', methods=['POST'])
def create_flight_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        flight_number = data.get('flight_number')
        source = data.get('source')
        destination = data.get('destination')
        capacity = data.get('capacity')
        price = data.get('price')

        if not all([flight_number, source, destination, isinstance(price, float)]):
            abort(400, description="Invalid data provided for flight creation")
            
        flight_id = system.create_flight(flight_number, source, destination, capacity, price)
        return jsonify({"message": "Flight created successfully!", "flight_id": flight_id}), 201
    except Exception as e:
        abort(400, description=str(e))


@app.route('/create_passenger', methods=['POST'])
def create_passenger_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        name = data.get('name')
        if not name:
            abort(400, description="Invalid data provided for passenger creation")
        passenger_id = system.create_passenger(name)
        return jsonify({"message": "Passenger created successfully!", "passenger_id": passenger_id}), 201
    except Exception as e:
        abort(400, description=str(e))


@app.route('/reserve_seat', methods=['POST'])
def reserve_seat_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        passenger_name = data.get('passenger_name')
        flight_id = data.get('flight_id')
        if not (passenger_name and isinstance(flight_id, int)):
            abort(400, description="Invalid data provided for seat reservation")
        passenger_id = system.get_passenger_id(passenger_name)
        if passenger_id is None:
            return jsonify({"message": "Passenger not found."}), 404
        if system.reserve_seat(passenger_id, flight_id):
            return jsonify({"message": "Seat reserved successfully."}), 200
        else:
            return jsonify({"message": "Seat reservation failed. No available seats."}), 400
    except Exception as e:
        abort(400, description=str(e))


@app.route('/available_flights', methods=['GET'])
def list_available_flights():
    conn = get_db()
    system = ReservationSystem(conn)
    flights = system.get_available_flights()
    return jsonify(flights), 200


@app.route('/create_food_item', methods=['POST'])
def create_food_item_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        name = data.get('name')
        price = data.get('price')
        if not (name and isinstance(price, (int, float))):
            abort(400, description="Invalid data provided for food item creation")
        system.create_food_item(name, price)
        return jsonify({"message": "Food item created successfully!"}), 201
    except Exception as e:
        abort(400, description=str(e))


@app.route('/create_streaming_service', methods=['POST'])
def create_streaming_service_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        name = data.get('name')
        price = data.get('price')
        if not (name and isinstance(price, (int, float))):
            abort(400, description="Invalid data provided for streaming service creation")
        system.create_streaming_service(name, price)
        return jsonify({"message": "Streaming service created successfully!"}), 201
    except Exception as e:
        abort(400, description=str(e))


@app.route('/create_seat_type', methods=['POST'])
def create_seat_type_endpoint():
    conn = get_db()
    system = ReservationSystem(conn)
    data = request.json
    try:
        type = data.get('type')
        price_multiplier = data.get('price_multiplier')
        if not (type and isinstance(price_multiplier, (int, float))):
            abort(400, description="Invalid data provided for seat type creation")
        system.create_seat_type(type, price_multiplier)
        return jsonify({"message": "Seat type created successfully!"}), 201
    except Exception as e:
        abort(400, description=str(e))


@app.route('/list_food_items', methods=['GET'])
def list_food_items():
    conn = get_db()
    system = ReservationSystem(conn)
    food_items = system.list_food_items()
    return jsonify(food_items), 200


@app.route('/list_streaming_services', methods=['GET'])
def list_streaming_services():
    conn = get_db()
    system = ReservationSystem(conn)
    streaming_services = system.list_streaming_services()
    return jsonify(streaming_services), 200


@app.route('/list_seat_types', methods=['GET'])
def list_seat_types():
    conn = get_db()
    system = ReservationSystem(conn)
    seat_types = system.list_seat_types()
    return jsonify(seat_types), 200

if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true')
