
class Jekyll::Converters::Markdown::MDP
  def initialize(config)
    require 'kramdown'
    require 'rouge'
    @config = config
  rescue LoadError
    raise FatalException.new('Missing Dependency')
  end

  def convert(content)
    content = content.gsub(/([A-Za-z0-9\]]+)([\u4e00-\u9fa5])/, '\1<span data-present="space"></span>\2')
    content = content.gsub(/([\u4e00-\u9fa5])([A-Za-z0-9\[\#]+)/, '\1<span data-present="space"></span>\2')
    Kramdown::Document.new(content, {
      auto_ids: false,
      footnote_backlink: "",
      smart_quotes: ["lsaquo", "rsaquo", "laquo", "raquo"],
      input: "GFM",
      syntax_highlighter: "rouge",
      syntax_highlighter_opts: {}
    }).to_html
  end
end
