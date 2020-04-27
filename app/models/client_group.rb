class ClientGroup < ApplicationRecord
    has_many :map_groups
    has_many :devices
end
