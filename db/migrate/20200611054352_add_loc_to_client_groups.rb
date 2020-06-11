class AddLocToClientGroups < ActiveRecord::Migration[5.1]
  def change
    add_column :client_groups, :longitude, :float
    add_column :client_groups, :latitude, :float
  end
end
