from flask import Flask, render_template, request, redirect, url_for, session
from models import *
from flask_socketio import SocketIO, emit


# Store all gigs and sales
GIGS = []
SALES = []

# Add initial gig and sale
initial_sale = initialise_gig_and_sale()
GIGS.append(initial_sale.gig)
SALES.append(initial_sale)


app = Flask(__name__)
app.secret_key = "set this later" # For doing the logins
socket = SocketIO(app, async_mode='gevent')


@app.route('/')
def index():
    """Render the home page with all gigs"""
    return render_template('home.html', gigs=GIGS)

@app.route('/add', methods=["GET", "POST"])
def add():
    if request.method == "POST":
        artist = request.form.get("artist")
        date_time = request.form.get("date_time")
        venue = request.form.get("venue")
        promoter_name = request.form.get("promoter")
        description = request.form.get("description", "")
        image_url = request.form.get("image_url", "")

        # Convert date_time string to datetime object
        from datetime import datetime
        try:
            date_time_obj = datetime.strptime(date_time, "%Y-%m-%dT%H:%M")
        except Exception:
            date_time_obj = datetime.now()

        promoter = Promoter(promoter_name)
        new_gig = Gig(artist, date_time_obj, venue, promoter, description, image_url)
        GIGS.append(new_gig)
        return redirect(url_for("index"))
    return render_template("add.html")

@app.route('/buy', methods=["POST"]) # The button that takes you from the homepage to the buy page
def buy_page():
    """Render the ticket purchase page"""
    # Use the first sale for ticket purchase
    return render_template('buy.html', gig_sale=SALES[0])



@app.route('/login', methods=["POST"])
def login():
    session["username"] = request.form["username"]
    return redirect(url_for("index"))

@app.route('/login_page')
def login_page():
    """Render the home page"""
    return render_template('login_page.html', gig_sale=SALES[0])

@app.route('/buy_now', methods=["POST"])
def buy_now():
    buyer = request.form['buyer']
    buy_amount_str = request.form['buy_amount']
    buy_amount = int(float(buy_amount_str))
    SALES[0].buy(buyer, buy_amount)
    socket.emit("buyer", {"buyer": buyer, "buy_amount": buy_amount})
    return redirect(url_for("purchased"))

@app.route('/purchased')
def purchased():
    """Render the home page"""
    return render_template('purchased.html', gig_sale=SALES[0])



#@socket.on('ping')
#def send_pong():
#    """Process a new message and broadcast it to all users"""
#    emit('pong', broadcast=True)


if __name__ == '__main__':
    # For production use (or adapt further for different async modes):
    #   gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
      socket.run(app, debug=True, use_reloader=False, host="0.0.0.0", port=8001)
    # app.run(debug=True, port=8000)