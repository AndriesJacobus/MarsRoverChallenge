require "administrate/base_dashboard"

class MapGroupDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    client_group: Field::BelongsTo,
    devices: Field::HasMany,
    logs: Field::HasMany,
    id: Field::Number,
    Name: Field::String,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    updated_at: Field::DateTime,
    startLon: Field::Number.with_options(decimals: 2),
    startLat: Field::Number.with_options(decimals: 2),
    endLon: Field::Number.with_options(decimals: 2),
    endLat: Field::Number.with_options(decimals: 2),
    state: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    client_group
    devices
    logs
    id
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    client_group
    devices
    logs
    id
    Name
    updated_at
    startLon
    startLat
    endLon
    endLat
    state
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    client_group
    devices
    logs
    Name
    startLon
    startLat
    endLon
    endLat
    state
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how map groups are displayed
  # across all pages of the admin dashboard.
  
  def display_resource(map_group)
    map_group.Name
  end
end
