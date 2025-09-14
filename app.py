from flask import Flask, render_template
from models import *
# from flask_socketio import SocketIO, emit

app = Flask(__name__)
# socket = SocketIO(app, async_mode='gevent')


GIG = initialise_gig_and_sale()

@app.route('/')
def index():
    """Render the home page"""
    return render_template('home.html')


#@socket.on('ping')
#def send_pong():
#    """Process a new message and broadcast it to all users"""
#    emit('pong', broadcast=True)


if __name__ == '__main__':
    # For production use (or adapt further for different async modes):
    #   gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
    #    socket.run(app, debug=True, use_reloader=False, host="0.0.0.0", port=8000)
    app.run(debug=True, port=8000)