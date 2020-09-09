class ClientDetail < ApplicationRecord
    belongs_to :client, optional: true
end
