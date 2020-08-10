json.extract! alarm, :id, :acknowledged, :date_acknowledged, :alarm_reason, :note, :created_at, :updated_at
json.url alarm_url(alarm, format: :json)
