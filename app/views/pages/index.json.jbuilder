json.array!(@pages) do |page|
  json.extract! page, :title, :body, :slug
  json.url page_url(page, format: :json)
end
