json.extract! message, :id, :Time, :Data, :LQI, :created_at, :updated_at
json.url message_url(message, format: :json)
