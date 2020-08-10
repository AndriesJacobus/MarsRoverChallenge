class CreateAlarms < ActiveRecord::Migration[5.1]
  def change
    create_table :alarms do |t|
      t.boolean :acknowledged
      t.datetime :date_acknowledged
      t.string :alarm_reason
      t.string :note

      t.timestamps
    end
  end
end
