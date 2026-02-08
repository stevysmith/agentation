module Agentation
  ASSET_PATH = "/__agentation__/agentation.js"

  class Middleware
    def initialize(app)
      @app = app
    end

    def call(env)
      # Serve the JS file directly when requested
      return serve_js(env) if env["PATH_INFO"] == ASSET_PATH

      status, headers, response = @app.call(env)

      return [status, headers, response] unless inject?(status, headers)

      body = +""
      response.each { |part| body << part }
      response.close if response.respond_to?(:close)

      body = body.sub(%r{</head>}i, "#{head_tag}\n</head>")
      body = body.sub(%r{</body>}i, "#{body_tag}\n</body>") if body_tag

      headers.delete("Content-Length")

      [status, headers, [body]]
    end

    private

    def serve_js(env)
      [
        200,
        {
          "Content-Type" => "application/javascript",
          "Content-Length" => agentation_js.bytesize.to_s,
          "Cache-Control" => "no-cache"
        },
        [agentation_js]
      ]
    end

    def inject?(status, headers)
      return false unless Agentation.configuration.enabled?
      return false unless status == 200

      content_type = headers["Content-Type"]
      content_type&.include?("text/html")
    end

    def head_tag
      @head_tag ||= %(<script src="#{ASSET_PATH}" defer></script>)
    end

    def body_tag
      @body_tag ||= begin
        config = Agentation.configuration
        attrs = []
        attrs << %( data-endpoint="#{config.endpoint}") if config.endpoint
        attrs << %( data-session-id="#{config.session_id}") if config.session_id
        attrs << %( data-webhook-url="#{config.webhook_url}") if config.webhook_url

        return nil if attrs.empty?

        %(<div id="agentation-config" style="display:none"#{attrs.join}></div>)
      end
    end

    def agentation_js
      @agentation_js ||= File.read(
        File.expand_path("../../app/assets/javascripts/agentation.js", __dir__)
      )
    end
  end
end
