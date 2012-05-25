App =
  boot: ->
    App.view = new App.View()
    _.each ["bootstrap/button"], (name)->
      $.getJSON "components/#{name}.json", (response)->
        UI.registerComponent(response)
        App.view.picker.render()

  View: Backbone.View.extend
    events:
      'component:set': 'setComponent'

    initialize: ->
      @setElement $('body').get(0)
      @visual = new App.Visual(el: $('#visual').get(0))
      @picker = new App.Picker(el: $('#drawer ul').get(0))
      @inspector = new App.Inspector(el: $('#inspector').get(0))
      @source = new App.Source(el: $('#source').get(0))

    setComponent: (e, component)->
      @visual.setComponent(component)
      @inspector.setComponent(component)
      @source.setComponent(component)

  Visual: Backbone.View.extend
    initialize: ->
      @frame = @$el.contents()
    render: ->
      if @model.css?
        @frame.find('head link').remove()
        _.each @model.stylesheets(), (url)=>
          @frame.find('head').append("<link rel='stylesheet component' href='#{url}'/>")
      @frame.find('body').html(@model.render())
      this
    setComponent: (component)->
      @model = component
      @model.bind 'change', @render, @
      @render()

  Source: Backbone.View.extend
    initialize: ->
      @render()
    setComponent: (component)->
      @model = component
      @model.bind 'change', @render, @
      @render()
    render: ->
      if @model
        @$el.text @model.source()
        hljs.highlightBlock(@el)
      else
        @$el.html ''
      this

  Picker: Backbone.View.extend
    events:
      'click a': 'switchComponent'

    render: ->
      @$el.html('')
      _.each UI.Components, (component)=>
        @$el.append("<li><a data-component='#{component.prototype.name}'>#{component.prototype.label}</a></li>")
      this

    switchComponent: (e)->
      component = $(e.currentTarget).attr('data-component')
      @$el.trigger 'component:set', new UI.Components[component]()

  Inspector: Backbone.View.extend
    events:
      'change input, select': 'changed'
      'keyup input': 'changed'
    setComponent: (component)->
      @model = component
      @render()
    render: ->
      @$el.html ''
      @model.fields.each (field)=>
        @$el.append field.view.render(@model.get(field.get('name'))).el
    changed: (e)->
      $input = $(e.currentTarget)
      val = $input.val()
      val = null if $input.is('[type=checkbox]') and $input.is(':not(:checked)')
      @model.set $input.attr('name'), val

  Components: Backbone.Collection.extend
    model: UI.Component

window.App = App
$ -> App.boot()