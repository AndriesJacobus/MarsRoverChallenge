class CreateLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :logs do |t|
      t.string :trigger_by_bot
      t.string :action_type

      t.timestamps
    end
  end
end
