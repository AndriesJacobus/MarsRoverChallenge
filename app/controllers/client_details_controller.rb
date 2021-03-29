class ClientDetailsController < ApplicationController
  before_action :set_client_detail, only: [:show, :edit, :update, :destroy]

  # GET /client_details
  # GET /client_details.json
  def index
    # Only Admins can view index
    if current_user.usertype == "Sysadmin"
      @client_details = ClientDetail.all.order('updated_at DESC')
    elsif current_user.usertype == "Client Admin"
      if current_user.client_detail
        @client_details = ClientDetail.where(id: current_user.client_detail.id).order('updated_at DESC')
      else
        @client_details = []
      end
    else
      # redirect_to root_path, flash: {warning: 'Please log in as an Admin before viewing this page' }
      redirect_to root_path, flash: {warning: 'Please log in before viewing this page' }
    end
  end

  # GET /client_details/1
  # GET /client_details/1.json
  def show
  end

  # GET /client_details/new
  def new
    @client_detail = ClientDetail.new
  end

  # GET /client_details/1/edit
  def edit
  end

  # POST /client_details
  # POST /client_details.json
  def create
    @client_detail = ClientDetail.new(client_detail_params)

    respond_to do |format|
      if @client_detail.save
        format.html { redirect_to @client_detail, notice: 'Client detail was successfully created.' }
        format.json { render :show, status: :created, location: @client_detail }
      else
        format.html { render :new }
        format.json { render json: @client_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /client_details/1
  # PATCH/PUT /client_details/1.json
  def update
    respond_to do |format|
      if @client_detail.update(client_detail_params)
        format.html { redirect_to @client_detail, notice: 'Client detail was successfully updated.' }
        format.json { render :show, status: :ok, location: @client_detail }
      else
        format.html { render :edit }
        format.json { render json: @client_detail.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /client_details/1
  # DELETE /client_details/1.json
  def destroy
    @client_detail.destroy
    respond_to do |format|
      format.html { redirect_to client_details_url, notice: 'Client detail was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_client_detail
      @client_detail = ClientDetail.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def client_detail_params
      params.require(:client_detail).permit(:name, :company_name, :business_address)
    end
end
