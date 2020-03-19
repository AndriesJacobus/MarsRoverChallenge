json.extract! device, :id, :Name, :SigfoxID, :SigfoxName, :SerialNumber, :Longitude, :Latitude, :SigfoxDeviceTypeID, :SigfoxDeviceTypeName, :SigfoxGroupID, :SigfoxGroupName, :SigfoxActivationTime, :SigfoxCreationTime, :SigfoxCreatedByID, :created_at, :updated_at
json.url device_url(device, format: :json)
