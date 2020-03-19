class CreateDevices < ActiveRecord::Migration[5.1]
  def change
    create_table :devices do |t|
      t.string :Name
      t.string :SigfoxID
      t.string :SigfoxName
      t.string :SerialNumber
      t.decimal :Longitude
      t.decimal :Latitude
      t.string :SigfoxDeviceTypeID
      t.string :SigfoxDeviceTypeName
      t.string :SigfoxGroupID
      t.string :SigfoxGroupName
      t.integer :SigfoxActivationTime
      t.integer :SigfoxCreationTime
      t.string :SigfoxCreatedByID

      t.timestamps
    end
  end
end
