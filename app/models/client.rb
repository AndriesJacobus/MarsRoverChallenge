class Client < ApplicationRecord
    has_many :users
    has_many :client_groups
    has_many :logs, dependent: :nullify
    
    has_one :client_detail
end
