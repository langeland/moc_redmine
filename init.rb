require 'gerrit_hook_listener'

Redmine::Plugin.register :gerrit do
	name 'Gerrit plugin'
	author 'Jon Klixbull Langeland'
	description 'Get data from gerrit'
	version '0.0.1'
	url 'http://moc.net'
	author_url 'http://moc.net'
	#settings :default => {'empty' => true}, :partial => 'settings/gerrit_settings'
	permission :gerrit_access, :gerrit => :view
end
