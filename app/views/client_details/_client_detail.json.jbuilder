json.extract! client_detail, :id, :name, :company_name, :business_address, :created_at, :updated_at
json.url client_detail_url(client_detail, format: :json)
