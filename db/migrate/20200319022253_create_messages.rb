class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.integer :Time
      t.string :Data
      t.integer :LQI

      t.timestamps
    end
  end
end
