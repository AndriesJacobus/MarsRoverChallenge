class AddDevicesToMapGroups < ActiveRecord::Migration[5.1]
  def change
    add_column :map_groups, :devices_added, :integer, array: true, default: []
  end
end
