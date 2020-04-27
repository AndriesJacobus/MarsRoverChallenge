class Device < ApplicationRecord
    belongs_to :map_group, optional: true

    has_many :messages
end
