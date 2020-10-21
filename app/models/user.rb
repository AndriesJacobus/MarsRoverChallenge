class User < ApplicationRecord
  require 'securerandom'
  has_secure_password
  before_create :generate_random_id
  
  belongs_to :client, optional: true
  has_many :logs, dependent: :nullify
  has_many :alarms

  validates :email, presence: true, uniqueness: true
  
  private 
    def generate_random_id
      self.id = SecureRandom.random_number(2147483646)
    end 

end
