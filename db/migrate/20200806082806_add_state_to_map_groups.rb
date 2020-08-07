class AddStateToMapGroups < ActiveRecord::Migration[5.1]
  def change
    add_column :map_groups, :state, :string
  end
end
