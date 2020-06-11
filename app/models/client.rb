class Client < ApplicationRecord
    has_many :users
    has_many :client_groups
    has_many :logs
end
