module API
  module V1
    module Defaults
      extend ActiveSupport::Concern

      included do
        prefix "api"
        version "v1", using: :path
        default_format :json
        format :json

        before do
          header['Access-Control-Allow-Origin'] = '*'
          header['Access-Control-Request-Method'] = '*'
        end

        helpers do
          def permitted_params
            @permitted_params ||= declared(params, include_missing: false)
          end

          def logger
            Rails.logger
          end

          def send_action_cable_update(update_type, id, attribute, new_attribute, client_group_id)
            
            # Send action cable message to update relevant device's state
            data = {
              update: update_type,
              id: id,
              attribute: attribute,
              to: new_attribute,
            }
            ActionCable.server.broadcast("live_map_#{client_group_id}", data.as_json)

          end
        end

        rescue_from ActiveRecord::RecordNotFound do |e|
          error_response(message: e.message, status: 404)
        end

        rescue_from ActiveRecord::RecordInvalid do |e|
          error_response(message: e.message, status: 422)
        end
      end
    end
  end
end