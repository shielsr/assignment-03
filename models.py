class Promoter:
	def __init__(self, name):
		self.name

class Customer:
	def __init__(self, name):
		self.name = name

class Gig:
	def __init__(self, artist, description="", date, time, image_url="", venue):
		self.artist = artist
		self.description = description
		self.date = date
		self.time = time
		self.image_url = image_url
		self.venue = venue

	def __repr__(self):
		return f"Gig(artist='{self.artist}', date='{self.date}, venue='{self.venue}', status = '{self.status}')"

class Sale:
	COMPLETE = object()
	LIVE = object()
	PENDING = object()

	def __init__(self):
		self.sale_date = sale_date
		self.sale_time = sale_time
		self.status = Sale.PENDING
		self.ticket_price = price

class Buy:
	def __init__(self, promoter, buyer, quantity):
		self.promoter = promoter
		self.buyer = buyer
		self.quantity= quantity