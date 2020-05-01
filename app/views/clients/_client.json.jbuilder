json.extract! client, :id, :Name, :SigfoxDeviceTypeID, :SigfoxDeviceTypeName, :created_at, :updated_at
json.url client_url(client, format: :json)
