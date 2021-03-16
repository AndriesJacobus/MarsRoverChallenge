class AddZoomLevelToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :client_groups, :zoom_level, :integer, default: 8
  end
end
