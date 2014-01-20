class GerritHookListener < Redmine::Hook::ViewListener
	
	def view_projects_show_left(context={} )
		#return content_tag("p", "Custom content added to the left")
	end
	
	def view_projects_show_right(context={} )
		#return content_tag("p", "Custom content added to the right")
	end
	
	def view_issues_show_details_bottom(context={} )
		#return content_tag("p", "view_issues_show_details_bottom :: Custom content added to the details bottom")
	end
	def view_issues_show_description_bottom(context={} )
		#return content_tag("p", "view_issues_show_description_bottom :: Custom content added to the description bottom")
	end
	
	
	render_on :view_issues_show_details_bottom, :partial => "issues/gerrit_details"
	render_on :view_issues_show_description_bottom, :partial => "issues/gerrit_description"
		
end