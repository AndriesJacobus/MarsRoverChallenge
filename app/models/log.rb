class Log < ApplicationRecord
    belongs_to :client, optional: true
    belongs_to :client_group, optional: true
    belongs_to :map_group, optional: true
    belongs_to :device, optional: true
    belongs_to :message, optional: true
    belongs_to :user, optional: true
end
