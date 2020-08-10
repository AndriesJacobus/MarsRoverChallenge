class AddStateIndicatorToAlarms < ActiveRecord::Migration[5.1]
  def change
    add_column :alarms, :state_change_to, :string
  end
end
