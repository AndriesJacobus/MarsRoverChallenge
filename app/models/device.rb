class Device < ApplicationRecord
    belongs_to :map_group

    has_many :messages
end
