from enum import Enum, auto
from datetime import datetime, date, timedelta
from decimal import Decimal

class TicketError(Exception):
	pass

# As a promoter, I want to post upcoming gigs with details on artist, time, date, and venue, so fans will know what gigs are coming up.



class Promoter:
	def __init__(self, name):
		self.name = name

	def __repr__(self):
		return f"Promoter(name='{self.name}')"

class Customer:
	def __init__(self, name, email):
		self.name = name
		self.email = email

	def __repr__(self):
		return f"Customer(name='{self.name}', email='{self.email}')"

class Gig:
	def __init__(self, artist, date_time, venue, promoter, description="", image_url=""):
		self.artist = artist
		self.date_time = date_time
		self.venue = venue
		self.promoter = promoter
		self.description = description
		self.image_url = image_url


	def __repr__(self):
		return f"Gig(artist='{self.artist}', description='{self.description}', date and time='{self.date_time}', venue='{self.venue}', promoter='{self.promoter}')"




class SaleStatus(Enum):
	# An enumeration of all possible sale statuses
	COMPLETE = auto()
	LIVE = auto()
	PENDING = auto()


class Sale:

	def __init__(self, gig, ticket_price, tickets_total, sale_date_time):
		# The promoter sets a date and time for the ticket sale (rather than the gig itself)
		self.gig = gig
		self.sale_date_time = sale_date_time
		self.ticket_price = ticket_price
		self.tickets_total = tickets_total # A fixed amount that won't change
		self.tickets_left =  tickets_total # A copy of tickets_total that will be reduced as tickets when tickets are sold
		self.status = SaleStatus.PENDING
		self.buyer = None
		self.order_list = []
		# self.customer = customer # Pulling in the customer

		
	def __repr__(self):
		return f"Sale(gig='{self.gig})', sale begins='{self.sale_date_time}', amount of tickets={self.tickets_total})"

	def ticket_check(self):
		# While the sale is live, check whether there are still tickets left
		if self.status == SaleStatus.LIVE:
			if self.tickets_total > 0:
				# return f"There are {self.tickets_total} tickets left."
				return {"tickets_left":self.tickets_total}
			else:
				self.status = SaleStatus.COMPLETE
				raise TicketError(f"Sorry, there are no tickets left.")
				# There probably should be a redirect away from the sales page
		else:
			return {"tickets_left":0}
   			#return f"Tickets aren't on sale yet."

	def countdown(self):
		# Counting down to the sale
		days_left = (self.start_date_time - datetime.now()).days
		if days_left > 0:
			self.status = SaleStatus.PENDING
			return f"Sale starts in {days_left} days."
		else:
			self.status = SaleStatus.LIVE
			return f"Sale is live."
		
	def buy(self, buyer, buy_amount):
		if self.tickets_left >= buy_amount: # Make sure there are enough tickets left
			self.order_list.append({ # Add the order details to the order_list
				"customer": buyer,
				"tickets": buy_amount
			})
			print (f"{buyer}, you are buying {buy_amount} tickets")
			print (f"Ticket price: {self.ticket_price}")
			print (f"Total cost: {self.ticket_price * buy_amount}")
			
			self.tickets_left = self.tickets_left - buy_amount
			print (f"There are {self.tickets_left} tickets left.")
			print(self.order_list)
		else:
			print (f"Sorry there aren't enough tickets left")




# Initialise a gig and sale

def initialise_gig_and_sale():
	"""Create a basic gig and sale to be used as a default"""
	mcd = Promoter(
    	name="MCD"
        )
	
	
	gig0001 = Gig(
		artist="Fontaines DC",
        description="Check out the next gig",
        date_time=datetime(2026,2,5,20,30,0),
        image_url="fontaines.jpg",
        venue="The Olympia",
        promoter=mcd
        )

	sale0001 = Sale(
    	ticket_price=20.50,
        tickets_total=999,
        sale_date_time=datetime(2025,3, 30, 10, 0, 0),
        gig = gig0001,
    )

	return sale0001