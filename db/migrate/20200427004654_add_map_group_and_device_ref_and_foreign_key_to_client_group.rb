class AddMapGroupAndDeviceRefAndForeignKeyToClientGroup < ActiveRecord::Migration[5.1]
  def change
    add_reference :map_groups, :client_group
    add_foreign_key :map_groups, :client_groups

    add_reference :devices, :client_group
    add_foreign_key :devices, :client_groups
  end
end
