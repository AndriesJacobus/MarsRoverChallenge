class MapGroup < ApplicationRecord
    belongs_to :client_group, optional: true
    
    has_many :devices
end
