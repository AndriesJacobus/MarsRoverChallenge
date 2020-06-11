class User < ApplicationRecord
  has_secure_password
  belongs_to :client, optional: true
  has_many :logs

  validates :email, presence: true, uniqueness: true
end
