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
