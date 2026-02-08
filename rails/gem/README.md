# agentation-rails

Drop-in Rails engine that adds the [Agentation](https://github.com/AnyContext-ai/agentation) annotation toolbar to your app in development. One line in your Gemfile, zero configuration.

## Installation

```ruby
# Gemfile
gem "agentation-rails", group: :development
```

```bash
bundle install
```

The toolbar appears automatically in development. Nothing to configure.

## Configuration (optional)

```ruby
# config/environments/development.rb
Agentation.configure do |config|
  config.endpoint = "http://localhost:4747"  # MCP sync server (default)
  config.webhook_url = "https://example.com/hooks/agentation"
end
```

## How it works

The gem inserts a `<script>` tag into every HTML response in development via Rack middleware. The script loads the Agentation toolbar, which lets you annotate page elements and send structured feedback to AI coding agents via the [Agentation MCP server](https://www.npmjs.com/package/agentation-mcp).

## Development

The built JS artifact is generated from the monorepo root:

```bash
pnpm build:rails
```

This bundles React + Agentation into a single IIFE at `gem/app/assets/javascripts/agentation.js`.

## License

PolyForm Shield 1.0.0
