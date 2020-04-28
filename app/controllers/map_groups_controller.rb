class MapGroupsController < ApplicationController
  before_action :set_map_group, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: :index

  # GET /map_groups
  # GET /map_groups.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @map_groups = MapGroup.all
    elsif current_user.usertype == "Client Admin"
      # Todo: filter map_groups to show only those with the same 'client'
      #       tag as the current Admin
      @map_groups = MapGroup.all
    else
      redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
    end
  end

  # GET /map_groups/1
  # GET /map_groups/1.json
  def show
  end

  # GET /map_groups/new
  def new
    @map_group = MapGroup.new
  end

  # GET /map_groups/1/edit
  def edit
  end

  # POST /map_groups
  # POST /map_groups.json
  def create
    @map_group = MapGroup.new(map_group_params)

    respond_to do |format|
      if @map_group.save
        format.html { redirect_to @map_group, flash: {success: 'Map group was successfully created' } }
        format.json { render :show, status: :created, location: @map_group }
      else
        format.html { render :new }
        format.json { render json: @map_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /map_groups/1
  # PATCH/PUT /map_groups/1.json
  def update
    respond_to do |format|
      if @map_group.update(map_group_params)
        format.html { redirect_to @map_group, flash: {success: 'Map group was successfully updated' } }
        format.json { render :show, status: :ok, location: @map_group }
      else
        format.html { render :edit }
        format.json { render json: @map_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /map_groups/1
  # DELETE /map_groups/1.json
  def destroy
    @map_group.devices.delete_all
    
    @map_group.destroy
    respond_to do |format|
      format.html { redirect_to map_groups_url, flash: {warning: 'Map group was successfully deleted' } }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_map_group
      @map_group = MapGroup.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def map_group_params
      params.require(:map_group).permit(:Name)
    end
end
