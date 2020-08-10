class AddPreviousStateIndicatorToAlarms < ActiveRecord::Migration[5.1]
  def change
    add_column :alarms, :state_change_from, :string
  end
end
