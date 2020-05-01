class SetUpdatedAtValues < ActiveRecord::Migration[5.1]
  def self.up
    User.where(usertype: "Admin").update_all(usertype: "Sysadmin")
  end

  def self.down
  end
end
