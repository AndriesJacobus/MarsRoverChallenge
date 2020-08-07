class SetDefaultMapGroupStateValues < ActiveRecord::Migration[5.1]
  def change
    MapGroup.where(state: nil).each do |map_group|
      map_group.state = "online"
      map_group.save
    end
  end
end
