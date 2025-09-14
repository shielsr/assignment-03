from flask import Flask, render_template, request, redirect, url_for, session
from models import *
from flask_socketio import SocketIO, emit

GIG_SALE = initialise_gig_and_sale()


app = Flask(__name__)
app.secret_key = "set this later" # For doing the logins
socket = SocketIO(app, async_mode='gevent')


@app.route('/')
def index():
    """Render the home page"""
    return render_template('home.html', gig_sale=GIG_SALE)

@app.route('/buy', methods=["POST"]) # The button that takes you from the homepage to the buy page
def buy_page():
    """Render the ticket purchase page"""
    return render_template('buy.html', gig_sale=GIG_SALE)


@app.route('/login', methods=["POST"])
def login():
    session["username"] = request.form["username"]
    return redirect(url_for("index"))

@app.route('/buy_now', methods=["POST"])
def buy_now():
    buyer = request.form['buyer']
    buy_amount_str = request.form['buy_amount']
    buy_amount = int(float(buy_amount_str))
    GIG_SALE.buy(buyer, buy_amount)
    socket.emit("buyer", {"buyer": buyer, "buy_amount": buy_amount})
    return redirect(url_for("purchased"))

@app.route('/purchased')
def purchased():
    """Render the home page"""
    return render_template('purchased.html', gig_sale=GIG_SALE)



#@socket.on('ping')
#def send_pong():
#    """Process a new message and broadcast it to all users"""
#    emit('pong', broadcast=True)


if __name__ == '__main__':
    # For production use (or adapt further for different async modes):
    #   gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
      socket.run(app, debug=True, use_reloader=False, host="0.0.0.0", port=8001)
    # app.run(debug=True, port=8000)