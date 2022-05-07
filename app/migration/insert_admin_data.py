from urllib import request
import json
import os
import json

from dotenv import load_dotenv
load_dotenv()


def read_file(file_fullname: str):
	"""
	This function Opening JSON file 
	returns JSON object as a dictionary
	Iterating through the json list and Closing file
	"""
	# 
	f = open(file_fullname)
	metadata = json.load(f)

	for item in metadata['data']:
		print(item)

		if file_fullname.__contains__('classrooms'):
			make_new_request('/classrooms_types', item)

		elif file_fullname.__contains__('documents'):
			make_new_request('/documents_types', item)

		elif file_fullname.__contains__('exams'):
			make_new_request('/exams_types', item)

		elif file_fullname.__contains__('roles'):
			make_new_request('/roles_types', item)

		elif file_fullname.__contains__('schedulers'):
			make_new_request('/schedulers_types', item)

		elif file_fullname.__contains__('semesters'):
			make_new_request('/semesters_type', item)

		else:
			print('error')

	f.close()
	
	
def make_new_request(service_name: str, item: dict):
	req = request.Request('http://web-api:8000' + os.getenv("API_URL") + service_name, method="POST")
	req.add_header('Content-Type', 'application/json')
	data = item
	data = json.dumps(data)
	data = data.encode()
	r = request.urlopen(req, data=data)
	content = r.read()
	print(content)



#read_file('./data/roles_types.json')

