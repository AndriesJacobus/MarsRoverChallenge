class AddDeviceRefToMapGroups < ActiveRecord::Migration[5.1]
  def change
    add_reference :devices, :map_group
  end
end
