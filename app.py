import os
from flask import Flask, render_template, request, redirect, url_for, session
from models import *
from datetime import datetime
from flask import jsonify


app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "fallback-secret-key") # For doing the logins

# A dict of logged in users
user_datastore = {}

# Lists to store all gigs and sales
GIGS = []
SALEEVENT = []

# Add initial gigs and sales
initial_sale = initialise_gig_and_sale()
GIGS.append(initial_sale.gig)
SALEEVENT.append(initial_sale)

# Add initial gigs and sales
initial_sale_2 = initialise_gig_and_sale_2()
GIGS.append(initial_sale_2.gig)
SALEEVENT.append(initial_sale_2)


@app.route('/')
def index():
    # Render the home page with all gigs
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
        ticket_price = float(request.form.get("ticket_price"))
        tickets_left = int(request.form.get("tickets_left"))
        sale_date_time = request.form.get("sale_date_time")

        # Convert date_time string to datetime object
        date_time_obj = datetime.strptime(date_time, "%Y-%m-%dT%H:%M")
        sale_date_time_obj = datetime.strptime(sale_date_time, "%Y-%m-%dT%H:%M")
            
        promoter = Promoter(promoter_name)
        
        # Creating objects to add to the GIGS and SALEEVENT list
        new_gig = Gig(artist, date_time_obj, venue, promoter, description, image_url)
        GIGS.append(new_gig)
        
        new_sale = Sale(new_gig, ticket_price, tickets_left, sale_date_time_obj)
        SALEEVENT.append(new_sale)

        return redirect(url_for("index"))
    return render_template("add.html", user_datastore=user_datastore)



@app.route('/check-tickets/<int:gig_id>')
def check_tickets(gig_id):
    """The 'Refresh tickets' button on the /buy pages, used mainly to demonstrate JS usage"""
    sale = SALEEVENT[gig_id]
    return jsonify( sale.ticket_check() )


@app.route('/buy/<int:gig_id>', methods=["GET", "POST"])
def buy_page(gig_id):
    """Generate the /buy pages
    Passes in data on the ticket sale and gig
    Adds the ID of the gig to the URL
    """
    gig = GIGS[gig_id]
    sale = SALEEVENT[gig_id]
    return render_template('buy.html', gig_sale=sale, gig_id=gig_id)


@app.route('/login-page', methods=["GET"])
def login_page():
    """Generate /login-page
    Also prevents logged-in users from accessing the page
    """
    if "username" in session:
            return redirect(url_for("index")) # Send to homepage if the user tries the /login-page url directly
    return render_template('login_page.html', gig_sale=SALEEVENT[0], logged_in_users=user_datastore)

@app.route('/my-account')
def my_account():
    return render_template('my_account.html', user_datastore=user_datastore)

@app.route('/login', methods=["POST"])
def login_action():
    """User presses the 'Log in' button on /login-page
    """
    username = request.form['username'] # Take the username from the form
    session["username"] = username  # Put it into the session
    user_datastore[username] = {"promoter": "MCD Productions"} # Update the datastore for that username
    return redirect(url_for("index"))

@app.route('/logout')
def logout():
    """Logout action for the app.
    This removes the user both from the session and from the user datastore.
    """
    # Get and remove the username from the session.
    username = session.pop('username', None)

    # Remove the user from the user datastore.
    user_datastore.pop(username, None)

    # Redirect to the home page.
    return redirect(url_for('index'))


@app.route('/update-promoter', methods=['POST'])
def update_promoter():
    """Updates the promoter name on the /my-account page
    """
    # If the user is not logged in, redirect to the login page
    if 'username' not in session:
        return redirect(url_for('login_form'))

    # Get the new promoter name from the form select
    update_promoter = request.form['update_promoter']

    # Get the username from the session.
    # Note this also means a user can only set their own status.
    username = session['username']

    # Update the promoter in the dict in the user datastore.
    user_datastore[username]['promoter'] = update_promoter
    # {{ user_datastore[session.username]['promoter'] }}
    
    # Redirect to the home page.
    return redirect(url_for('my_account'))


@app.route('/buy_now', methods=["POST"])
def buy_now():
    """Triggered by the user pressing the purchase button on the /buy page"""
    gig_id = int(request.form['gig_id'])
    buyer = request.form['buyer']
    buy_amount_str = request.form['buy_amount']
    buy_amount = int(float(buy_amount_str))
    SALEEVENT[gig_id].buy(buyer, buy_amount)
    # return str(SALEEVENT[gig_id].order_list)   # Storing the user and ticket amount in a dict. Beyond the scope of the assignment.
    return redirect(url_for("purchased", gig_id=gig_id, buy_amount=buy_amount ))

@app.route('/purchased')
def purchased():
    """Page that shows after the user has bought tickets"""
    gig_id = int(request.args.get('gig_id', 1))
    buy_amount = int(request.args.get('buy_amount'))
    return render_template('purchased.html', gig_sale=SALEEVENT[gig_id], gig_id=gig_id, buy_amount=buy_amount)


if __name__ == '__main__':
     app.run(debug=True, port=8000)