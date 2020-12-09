class ClientDetail < ApplicationRecord
    has_many :clients, dependent: :nullify
end
