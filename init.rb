require 'moc_redmine_hook_listener'

Redmine::Plugin.register :moc_redmine do
	name 'Moc Redmine plugin'
	author 'Jon Klixbull Langeland'
	description 'Get data from gerrit'
	version '0.0.1'
	url 'http://moc.net'
	author_url 'http://moc.net'
	permission :view_gerrit_changes, :gerrit_changes => :view
	permission :view_timelog_clippy, :timelog_clippy => :view
end
