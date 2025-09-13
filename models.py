# As a promoter, I want to post upcoming gigs with details on artist, time, date, and venue, so fans will know what gigs are coming up.



class Promoter:
	def __init__(self, name):
		self.name = name

class Customer:
	def __init__(self, name):
		self.name = name

class Gig:
	def __init__(self, artist, description, date, time, image_url, venue, promoter):
		self.artist = artist
		self.description = description
		self.date = date
		self.time = time
		self.image_url = image_url
		self.venue = venue
		self.promoter = promoter

	def __repr__(self):
		return f"Gig(artist='{self.artist}', description='{self.description}', date='{self.date} at {self.time}', venue='{self.venue}', promoter='{self.promoter}')"




class SaleStatus(Enum):
	COMPLETE = object()
	LIVE = object()
	PENDING = object()


class Sale:

	def __init__(self, sale_date, sale_time, ticket_price):
		self.sale_date = sale_date
		self.sale_time = sale_time
		self.ticket_price = ticket_price
		self.status = SaleStatus.PENDING
		

class Buy:
	def __init__(self, promoter, buyer, quantity):
		self.promoter = promoter
		self.buyer = buyer
		self.quantity= quantity