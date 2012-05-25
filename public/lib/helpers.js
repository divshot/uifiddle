(function() {
  var Helpers, exports;

  Helpers = {
    Templates: {
      text: Handlebars.compile("<div class='inline-field'>\n  <label for=\"component_{{component}}_{{name}}\">{{label}}</label><input type='text' name='{{name}}' id='component_{{component}}_{{name}}' value='{{value}}'/>\n</div>"),
      checkbox: Handlebars.compile("<div class='checkbox-field'>\n  <input type='checkbox' name='{{name}}' id='component_{{component}}_{{name}}' value='true' {{#if value}} checked{{/if}}/>\n  <label for='component_{{component}}_{{name}}'>{{label}}</label>\n</div>"),
      select: Handlebars.compile("<div class='inline-field'>\n  <label for=\"component_{{component}}_{{name}}\">{{label}}</label><select id='component_{{component}}_{{name}}' name='{{name}}'>\n    {{#each options}}\n    <option value=\"{{value}}\"{{#if selected}} selected{{/if}}>{{label}}</option>\n    {{/each}}\n  </select>\n</div>"),
      textarea: Handlebars.compile("<div class='block-field'>\n  <label for=\"component_{{component}}_{{name}}\">{{label}}</label><textarea name='{{name}}' id='component_{{component}}_{{name}}'>{{{value}}}</textarea>\n</div>")
    },
    field: function(options, value) {
      if (Helpers[options.type] != null) {
        return Helpers[options.type](options, value);
      } else {
        return Helpers.Templates[options.type](_.extend(options, {
          value: value || options["default"]
        }));
      }
    },
    select: function(options, value) {
      var selections,
        _this = this;
      selections = _.map(options.options, function(option) {
        return {
          label: option[0],
          value: option[1],
          selected: value === option[1]
        };
      });
      return Helpers.Templates.select(_.extend(_.clone(options), {
        options: selections,
        value: value || options["default"]
      }));
    }
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports = Helpers;
  } else {
    window.Helpers = Helpers;
  }

}).call(this);
