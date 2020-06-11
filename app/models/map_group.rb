class MapGroup < ApplicationRecord
    belongs_to :client_group, optional: true
    
    has_many :devices
    has_many :logs
end
