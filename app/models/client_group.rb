class ClientGroup < ApplicationRecord
    belongs_to :client, optional: true

    has_many :map_groups
    has_many :devices
end
