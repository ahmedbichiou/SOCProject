import requests
import json
#MARKET STACK API
# API endpoint
url = "https://api.marketstack.com/v1/eod?access_key=f32c07084247cc9e5d3ffd4881a17fda"

# Define the query parameters for this year and last year
querystring_current_year = {
    "symbols": "NVDA",
    "date_from": "2024-07-01",
    "date_to": "2024-09-30"
}

querystring_last_year = {
    "symbols": "NVDA",
    "date_from": "2023-07-01",
    "date_to": "2023-09-30"
}

# Make the requests for both years
response_current_year = requests.get(url, params=querystring_current_year)
response_last_year = requests.get(url, params=querystring_last_year)

# Parse JSON responses
data_current_year = response_current_year.json()
data_last_year = response_last_year.json()

# Save the current year's data to a JSON file
with open('nvidia_eod_2024.json', 'w') as f_current:
    json.dump(data_current_year, f_current, indent=4)

# Save the last year's data to a JSON file
with open('nvidia_eod_2023.json', 'w') as f_last:
    json.dump(data_last_year, f_last, indent=4)

print("Data saved to nvidia_eod_2024.json and nvidia_eod_2023.json.")
