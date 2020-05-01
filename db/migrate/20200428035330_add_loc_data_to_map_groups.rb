class AddLocDataToMapGroups < ActiveRecord::Migration[5.1]
  def change
    add_column :map_groups, :startLon, :float
    add_column :map_groups, :startLat, :float
    add_column :map_groups, :endLon, :float
    add_column :map_groups, :endLat, :float
  end
end
