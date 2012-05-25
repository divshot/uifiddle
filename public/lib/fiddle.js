(function() {
  var App;

  App = {
    boot: function() {
      App.view = new App.View();
      return _.each(["bootstrap/alert", "bootstrap/breadcrumbs", "bootstrap/button", "bootstrap/heading", "bootstrap/hero"], function(name) {
        return $.getJSON("components/" + name + ".json", function(response) {
          console.log(response);
          UI.registerComponent(response);
          return App.view.picker.render();
        });
      });
    },
    View: Backbone.View.extend({
      events: {
        'component:set': 'setComponent'
      },
      initialize: function() {
        this.setElement($('body').get(0));
        this.visual = new App.Visual({
          el: $('#visual').get(0)
        });
        this.picker = new App.Picker({
          el: $('#drawer ul').get(0)
        });
        this.inspector = new App.Inspector({
          el: $('#inspector').get(0)
        });
        return this.source = new App.Source({
          el: $('#source').get(0)
        });
      },
      setComponent: function(e, component) {
        this.visual.setComponent(component);
        this.inspector.setComponent(component);
        return this.source.setComponent(component);
      }
    }),
    Visual: Backbone.View.extend({
      initialize: function() {
        return this.frame = this.$el.contents();
      },
      render: function() {
        var _this = this;
        if (this.model.css != null) {
          this.frame.find('head link').remove();
          _.each(this.model.stylesheets(), function(url) {
            return _this.frame.find('head').append("<link rel='stylesheet component' href='" + url + "'/>");
          });
        }
        this.frame.find('body').html(this.model.render());
        return this;
      },
      setComponent: function(component) {
        this.model = component;
        this.model.bind('change', this.render, this);
        return this.render();
      }
    }),
    Source: Backbone.View.extend({
      initialize: function() {
        return this.render();
      },
      setComponent: function(component) {
        this.model = component;
        this.model.bind('change', this.render, this);
        return this.render();
      },
      render: function() {
        if (this.model) {
          this.$el.text(this.model.source());
          hljs.highlightBlock(this.el);
        } else {
          this.$el.html('');
        }
        return this;
      }
    }),
    Picker: Backbone.View.extend({
      events: {
        'click a': 'switchComponent'
      },
      render: function() {
        var _this = this;
        this.$el.html('');
        _.each(UI.Components, function(component) {
          return _this.$el.append("<li><a data-component='" + component.prototype.name + "'>" + component.prototype.label + "</a></li>");
        });
        return this;
      },
      switchComponent: function(e) {
        var component;
        component = $(e.currentTarget).attr('data-component');
        return this.$el.trigger('component:set', new UI.Components[component]());
      }
    }),
    Inspector: Backbone.View.extend({
      events: {
        'change input, select': 'changed',
        'keyup input': 'changed'
      },
      setComponent: function(component) {
        this.model = component;
        return this.render();
      },
      render: function() {
        var _this = this;
        this.$el.html('');
        return this.model.fields.each(function(field) {
          return _this.$el.append(field.view.render(_this.model.get(field.get('name'))).el);
        });
      },
      changed: function(e) {
        var $input, val;
        $input = $(e.currentTarget);
        val = $input.val();
        if ($input.is('[type=checkbox]') && $input.is(':not(:checked)')) {
          val = null;
        }
        return this.model.set($input.attr('name'), val);
      }
    }),
    Components: Backbone.Collection.extend({
      model: UI.Component
    })
  };

  window.App = App;

  $(function() {
    return App.boot();
  });

}).call(this);
