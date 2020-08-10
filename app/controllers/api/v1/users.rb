module API
  module V1
    class Users < Grape::API
      include API::V1::Defaults

      resource :users do
        desc "Return a User using an ID"
        params do
          requires :id, type: String, desc: "ID of the User"
        end
        get "id" do
          @user = User.find_by(id: permitted_params[:id])

          if @user
            status 200
            {
              :status => :ok,
              :user_data => {
                "id": @user.id,
                "email": @user.email,
                "name": @user.name,
                "surname": @user.surname,
                "usertype": @user.usertype,
                "created_at": @user.created_at,
                "updated_at": @user.updated_at
              }
            }.as_json
          else
            status 422
            { :status => :unprocessable_entity, :message => "User with ID #{permitted_params[:id]} could not be found" }.as_json
          end
        end

        # desc "Return a User using an Auth Token"
        # params do
        #   requires :auth_token, type: String, desc: "Auth Token of the User"
        # end
        # post "get_user_info_using_auth_token" do
        #   @user = User.find_by(auth_token: permitted_params[:auth_token])

        #   if @user
        #     status 200
        #     {
        #       :status => :ok,
        #       :user_data => {
        #         "id": @user.id,
        #         "email": @user.email,
        #         "name": @user.name,
        #         "surname": @user.surname,
        #         "usertype": @user.usertype,
        #         "created_at": @user.created_at,
        #         "updated_at": @user.updated_at
        #       }
        #     }.as_json
        #   else
        #     status 422
        #     { :status => :unprocessable_entity, :message => "User with Auth Token #{permitted_params[:auth_token]} could not be found" }.as_json
        #   end
        # end

        # desc "Log a User In using an Auth Token"
        # params do
        #   requires :auth_token, type: String, desc: "Auth Token of the User"
        # end
        # post "auth_login" do
        #   begin
        #     @user = User.find_by(auth_token: permitted_params[:auth_token])

        #     if @user
        #       token = generate_auth_token

        #       if @user.update_attribute(:auth_token, token)
        #         status 200
        #         { :status => :ok, :message => "User Logged In successfully", :auth_token => token }.as_json
        #       else
        #         raise @user.errors
        #       end
        #     else
        #       status 422
        #       { :status => :unprocessable_entity, :message => "User with auth token #{permitted_params[:auth_token]} could not be found" }.as_json
        #     end

        #   rescue ActiveRecord::RecordInvalid => error
        #     status 406
        #     { :status => :not_acceptable, :message => "User could not be Logged In because #{error}" }.as_json
        #   end
        # end

        desc "Log a User In using a Password"
        params do
          requires :user, type: Hash, desc: 'The User Data' do

            requires :email, type: String, desc: 'Email of User'
            requires :password, type: String, desc: 'Password of User'

          end
        end
        post "pass_login" do
          begin
            @user = User.find_by_email(permitted_params[:user][:email])

            if @user && @user.authenticate(permitted_params[:user][:password])
              status 200
              { :status => :ok, :message => "User Logged In successfully" }.as_json

              # token = generate_auth_token

              # if @user.update_attribute(:auth_token, token)
              #   status 200
              #   { :status => :ok, :message => "User Logged In successfully", :auth_token => token }.as_json
              # else
              #   raise @user.errors
              # end
            else
              status 422
              { :status => :unprocessable_entity, :message => "Email or password Incorrect" }.as_json
            end

          rescue ActiveRecord::RecordInvalid => error
            status 406
            { :status => :not_acceptable, :message => "User could not be Logged In because #{error}" }.as_json
          end
        end

        # desc "Log a User Out"
        # params do
        #   requires :auth_token, type: String, desc: "Auth Token of the User"
        # end
        # post "logout" do
        #   begin
        #     @user = User.find_by(auth_token: permitted_params[:auth_token])

        #     if @user
        #       if @user.update_attribute(:auth_token, nil)
        #         status 200
        #         { :status => :ok, :message => "User Logged Out successfully", :auth_token => nil }.as_json
        #       else
        #         raise @user.errors
        #       end
        #     else
        #       status 422
        #       { :status => :unprocessable_entity, :message => "User with auth token #{permitted_params[:auth_token]} could not be found" }.as_json
        #     end

        #   rescue ActiveRecord::RecordInvalid => error
        #     status 406
        #     { :status => :not_acceptable, :message => "User could not be Logged Out because #{error}" }.as_json
        #   end
        # end

        desc "Create a User"
        params do
          requires :user, type: Hash, desc: 'The User Data' do

            requires :email, type: String, desc: 'Email of new User'
            requires :name, type: String, desc: 'First Name of new User'
            optional :surname, type: String, desc: 'Last Name of new User'
            requires :usertype, type: String, desc: 'Type of new User. Can be "Client Admin", or "Operator"', default: "Operator"
            requires :password, type: String, desc: 'Password of new User'
            requires :password_confirmation, type: String, desc: 'Password Confirmation of new User'

          end
        end
        post do
          begin
            if permitted_params[:user][:usertype] != "Client Admin" && permitted_params[:user][:usertype] != "Operator"
              status 406
              return { :status => :not_acceptable, :message => "User could not be created because usertype is invalid" }.as_json
            end

            @user = User.create!(permitted_params[:user])

            # token = generate_auth_token
            # @user.update_attribute(:auth_token, token)

            if @user.save!
              status 200
              { :status => :ok, :message => "User created successfully with new auth token" }.as_json
            else
              status 406
              { :status => :not_acceptable, :message => "User could not be created because #{@user.errors}" }.as_json
            end

          rescue ActiveRecord::RecordInvalid => error
            status 406
            { :status => :not_acceptable, :message => "User could not be created because #{error}" }.as_json
          end
        end

        desc 'Update a User'
        params do
          requires :user, type: Hash, desc: 'The User Data' do

            # requires :auth_token, type: String, desc: "Auth Token of the User"
            optional :email, type: String, desc: 'New Email of new User'
            optional :name, type: String, desc: 'New First Name of new User'
            optional :surname, type: String, desc: 'New Last Name of new User'
            optional :usertype, type: String, desc: 'New Type of new User. Can be "Company Admin", "Recycler", or "Collector"'
            optional :password, type: String, desc: 'New Password of new User'
            optional :password_confirmation, type: String, desc: 'New Password Confirmation of new User'

          end
        end
        put do
          begin
            if permitted_params[:user][:usertype] != "Client Admin" && permitted_params[:user][:usertype] != "Operator"
              status 406
              return { :status => :not_acceptable, :message => "User could not be created because usertype is invalid" }.as_json
            end

            @user = User.find_by(email: permitted_params[:user][:email])

            if @user
              if @user.update(permitted_params[:user])
                status 200
                { :status => :ok, :message => "User updated successfully with new data" }.as_json
              else
                raise @user.errors
              end
            else
              status 422
              { :status => :unprocessable_entity, :message => "User with auth email #{permitted_params[:user][:email]} could not be found" }.as_json
            end

          rescue ActiveRecord::RecordInvalid => error
            status 406
            { :status => :not_acceptable, :message => "User could not be updated because #{error}" }.as_json
          end

        end

        # desc 'Delete a User using an Auth Token'
        # params do
        #   requires :auth_token, type: String, desc: "Auth_token of the user"
        # end
        # delete do
        #   begin
        #     @user = User.find_by(auth_token: permitted_params[:auth_token])

        #     if @user
        #       @user.destroy
        #       status 200
        #       { :status => :ok, :message => "User was successfully deleted", :auth_token => nil }.as_json
        #     else
        #       status 422
        #       { :status => :unprocessable_entity, :message => "User with auth token #{permitted_params[:auth_token]} could not be found" }.as_json
        #     end

        #   rescue ActiveRecord::RecordInvalid => error
        #     status 406
        #     { :status => :not_acceptable, :message => "User could not be deleted because #{error}" }.as_json
        #   end
        # end

      end
    end
  end
end 