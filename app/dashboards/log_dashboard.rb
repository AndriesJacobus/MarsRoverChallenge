require "administrate/base_dashboard"

class LogDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    created_at: Field::Text.with_options(
      searchable: true,
    ),
    trigger_by_bot: Field::String,
    action_type: Field::String,
    user: Field::BelongsTo,
    client: Field::BelongsTo,
    client_group: Field::BelongsTo,
    map_group: Field::BelongsTo,
    device: Field::BelongsTo,
    message: Field::BelongsTo,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    created_at
    trigger_by_bot
    action_type
    user
    client
    client_group
    device
    message
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    client
    client_group
    map_group
    device
    message
    user
    id
    trigger_by_bot
    action_type
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    client
    client_group
    map_group
    device
    message
    user
    trigger_by_bot
    action_type
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

  # Overwrite this method to customize how logs are displayed
  # across all pages of the admin dashboard.
  
  def display_resource(log)
    "Log ##{log.id}"
  end
end
