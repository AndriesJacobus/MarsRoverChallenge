class AddRemoveDevicesFromMapGroups < ActiveRecord::Migration[5.1]
  def change
    remove_column :map_groups, :devices_added
  end
end
