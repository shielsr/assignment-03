from enum import Enum, auto
from datetime import datetime, date, timedelta

# As a promoter, I want to post upcoming gigs with details on artist, time, date, and venue, so fans will know what gigs are coming up.



class Promoter:
	def __init__(self, name):
		self.name = name

	def __repr__(self):
		return f"Promoter(name='{self.name}')"

class Customer:
	def __init__(self, name):
		self.name = name

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

	def __init__(self, gig, ticket_price, ticket_amount, start_date_time):
		self.gig = gig
		self.start_date_time = start_date_time
		self.ticket_price = ticket_price
		self.ticket_amount = ticket_amount
		self.status = SaleStatus.PENDING
		
	def __repr__(self):
		return f"Sale(gig='{self.gig})', sale begins='{self.start_date_time}', amount of tickets={self.ticket_amount})"

	def countdown(self):
		days_left = (self.start_date_time - datetime.now()).days
		if self.ticket_amount > 0:
			if days_left>0:
				return f"{self.status}, starting in {days_left} days"
			elif self.status is SaleStatus.LIVE: 
				return f"Sale is live"
		else:
			return f"Sale is over"

class Buy:
	def __init__(self, promoter, buyer, quantity):
		self.promoter = promoter
		self.buyer = buyer
		self.quantity= quantity