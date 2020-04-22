class CreateClients < ActiveRecord::Migration[5.1]
  def change
    create_table :clients do |t|
      t.string :Name
      t.string :SigfoxDeviceTypeID
      t.string :SigfoxDeviceTypeName

      t.timestamps
    end
  end
end
