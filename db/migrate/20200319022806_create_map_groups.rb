class CreateMapGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :map_groups do |t|
      t.string :Name

      t.timestamps
    end
  end
end
