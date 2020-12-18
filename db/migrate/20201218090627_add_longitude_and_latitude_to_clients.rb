class AddLongitudeAndLatitudeToClients < ActiveRecord::Migration[5.1]
  def change
    add_column :clients, :longitude, :float
    add_column :clients, :latitude, :float
  end
end
