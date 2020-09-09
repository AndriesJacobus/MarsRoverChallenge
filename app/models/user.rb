class User < ApplicationRecord
  has_secure_password
  
  belongs_to :client, optional: true
  has_many :logs
  has_many :alarms

  validates :email, presence: true, uniqueness: true
end
