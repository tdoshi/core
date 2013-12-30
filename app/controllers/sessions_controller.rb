class SessionsController < ApplicationController
  def create
  	puts "hello"
  	puts env["omniauth.auth"]
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    redirect_to root_url
  end

  def destroy
  	session[:user_id] = nil
  	redirect_to root_url
  end
end