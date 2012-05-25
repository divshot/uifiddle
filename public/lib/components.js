(function() {
  var UI;

  UI = {
    Components: {},
    Resources: {
      CSS: {
        bootstrap: '/stylesheets/bootstrap.css'
      }
    }
  };

  UI.registerComponent = function(data) {
    var component;
    data = _.clone(data);
    data.fields = new UI.Fieldset(data.fields, {
      parse: true
    });
    component = UI.Component.extend(data);
    component.prototype.fields.each(function(field) {
      return field.component = data.name;
    });
    return UI.Components[data.name] = component;
  };

  UI.Component = Backbone.Model.extend({
    initialize: function() {
      return this.view = new UI.ComponentView({
        model: this
      });
    },
    stylesheets: function(overrides) {
      if (overrides == null) {
        overrides = {};
      }
      return _.map(this.css, function(style) {
        return overrides[style] || UI.Resources.CSS[style] || style;
      });
    },
    source: function() {
      return this.view.source();
    },
    render: function() {
      return this.view.render().el;
    },
    toJSON: function() {
      return _.extend(this.fields.defaults(), this.attributes);
    }
  });

  UI.ComponentView = Backbone.View.extend({
    initialize: function() {
      return this.template = Handlebars.compile(this.model.template);
    },
    source: function() {
      return this.template(this.model.toJSON());
    },
    render: function() {
      var newEl;
      newEl = $(this.source());
      if (this.el) {
        this.$el.replaceWith(newEl);
      }
      this.setElement(newEl);
      return this;
    }
  });

  UI.Field = Backbone.Model.extend({
    initialize: function() {
      return this.view = new UI.FieldView({
        model: this
      });
    },
    toJSON: function() {
      return _.extend(this.attributes, {
        component: this.component.replace(/\//g, '-')
      });
    }
  });

  UI.FieldView = Backbone.View.extend({
    render: function(value) {
      this.$el.html(Helpers.field(this.model.toJSON(), value || this.model.get('default')));
      return this;
    }
  });

  UI.Fieldset = Backbone.Collection.extend({
    model: UI.Field,
    defaults: function() {
      var out;
      out = {};
      this.each(function(field) {
        return out[field.get('name')] = field.get('default');
      });
      return out;
    }
  });

  window.UI = UI;

}).call(this);
