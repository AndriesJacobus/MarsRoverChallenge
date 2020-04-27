class User < ApplicationRecord
  has_secure_password
  belongs_to :client, optional: true

  validates :email, presence: true, uniqueness: true
end
