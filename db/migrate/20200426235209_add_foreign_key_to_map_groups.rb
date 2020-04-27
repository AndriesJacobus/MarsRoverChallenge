class AddForeignKeyToMapGroups < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :devices, :map_groups
  end
end
