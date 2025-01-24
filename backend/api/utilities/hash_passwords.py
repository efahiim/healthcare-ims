import json
from django.contrib.auth.hashers import make_password

# Load the fixture file
input_file = '/Users/imfe/Documents/Projects/healthcare-ims/backend/api/fixtures/initial_data.json'
output_file = '/Users/imfe/Documents/Projects/healthcare-ims/backend/api/fixtures/hashed_initial_data.json'

with open(input_file, 'r') as f:
    data = json.load(f)

# Hash the passwords
for entry in data:
    if entry['model'] == 'api.user' and 'password' in entry['fields']:
        entry['fields']['password'] = make_password(entry['fields']['password'])

# Save the updated fixture
with open(output_file, 'w') as f:
    json.dump(data, f, indent=4)

print(f"Fixture with hashed passwords has been saved to {output_file}")
