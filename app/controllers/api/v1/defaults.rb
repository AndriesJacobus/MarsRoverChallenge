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

          def client_and_client_group_quick_setup(device_id, sigfox_device_type_id)
            # Create new client group that is linked with the correct client
            # and link the device to the new client group

            # Find correct device
            @device = Device.where(id: device_id).take

            if @device

              # Find correct client
              @client = Client.where(SigfoxDeviceTypeID: sigfox_device_type_id).take

              if @client.nil?
                # Create a new client
                @client = Client.create(Name: "Site #{sigfox_device_type_id} from Sigfox",
                  SigfoxDeviceTypeID: sigfox_device_type_id,
                )
                @client.save
              end

              # Create new client group
              @new_client_group = ClientGroup.where(Name: "Group #{sigfox_device_type_id} from Sigfox").take

              if @new_client_group.nil?
                @new_client_group = ClientGroup.create(Name: "Group #{sigfox_device_type_id} from Sigfox")
                @new_client_group.save
              end

              # Link new client group with client
              @new_client_group.client = @client
              @new_client_group.save

              # Link device with new client group
              @device.client_group = @new_client_group
              @device.save

            end

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