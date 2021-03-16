require "administrate/base_dashboard"

class ClientGroupDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    client: Field::BelongsTo,
    map_groups: Field::HasMany,
    devices: Field::HasMany,
    logs: Field::HasMany,
    id: Field::Number,
    Name: Field::String,
    SigfoxGroupID: Field::String,
    SigfoxGroupName: Field::String,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    updated_at: Field::DateTime,
    longitude: Field::Number.with_options(decimals: 2),
    latitude: Field::Number.with_options(decimals: 2),
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    client
    map_groups
    devices
    logs
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    client
    map_groups
    devices
    logs
    id
    Name
    SigfoxGroupID
    SigfoxGroupName
    updated_at
    longitude
    latitude
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    client
    map_groups
    devices
    logs
    Name
    SigfoxGroupID
    SigfoxGroupName
    longitude
    latitude
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

  # Overwrite this method to customize how client groups are displayed
  # across all pages of the admin dashboard.
  
  def display_resource(client_group)
    client_group.Name
  end
end
