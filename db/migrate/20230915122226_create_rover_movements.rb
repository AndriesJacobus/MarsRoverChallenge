class CreateRoverMovements < ActiveRecord::Migration[6.1]
  def change
    create_table :rover_movements do |t|
      t.string :input
      t.string :output

      t.timestamps
    end
  end
end
